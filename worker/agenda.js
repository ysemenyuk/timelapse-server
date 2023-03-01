import { Agenda } from 'agenda/es.js';
import mongodb from 'mongodb';
import jobs from './jobs/jobs.js';
import debug from 'debug';
import socket from '../socket/socket.js';
import { taskStatus } from '../utils/constants.js';

const { MongoClient, ObjectID } = mongodb;
const logger = debug('worker');

const dbUri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME;

class Worker {
  constructor() {
    this.socket;
    this.mongoClient;
    this.agenda;
  }

  async start(jobTypes) {
    this.socket = socket;
    this.mongoClient = new MongoClient(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await this.mongoClient.connect();

    this.agenda = new Agenda({ mongo: this.mongoClient.db(dbName) });

    jobTypes.forEach((type) => {
      this.agenda.define(type, async (job) => {
        const data = job.attrs.data;
        await jobs[type](data, this.socket, logger, this);
      });
    });

    if (jobTypes.length) {
      await this.agenda.start();
      logger(`agenda successfully started`);
    }

    const currentjobs = await this.agenda.jobs();
    logger(`agenda currentjobs: ${currentjobs.length}`);

    if (currentjobs.length) {
      // await Promise.all(currentjobs.map(async (job) => await job.remove()));
      // currentjobs.forEach((job) => {
      //   console.log(job.attrs);
      // });
    }
  }

  //

  async socketNotification(userId, name, message) {
    const job = this.agenda.create('socketNotification', { userId, name, message });
    await job.save();
  }

  //

  async createTaskJob(task) {
    await this.removeTaskJobs(task.id);

    if (task.type === 'OneTime') {
      await this.createOneTimeTaskJob(task);
    }
    if (task.type === 'RepeatEvery') {
      const interval = `${task.photoSettings.interval} seconds`;
      await this.createRepeatEveryTaskJob(task, interval);
    }
  }

  createJobByTask(task) {
    return this.agenda.create(task.name, {
      userId: task.user,
      cameraId: task.camera,
      taskId: task._id,
    });
  }

  async createOneTimeTaskJob(task) {
    const job = this.createJobByTask(task);
    await job.save();
  }

  async createRepeatEveryTaskJob(task, interval) {
    const job = this.createJobByTask(task);
    await job.repeatEvery(interval).save();
  }

  //

  async updateTaskJob(task) {
    if (task.type === 'OneTime') {
      await this.updateOnTimeTaskJob(task);
    }
    if (task.type === 'RepeatEvery') {
      await this.updateRepeatEveryTaskJob(task);
    }
  }

  async updateOnTimeTaskJob(task) {
    if (task.status === taskStatus.CANCELED) {
      await this.removeTaskJobs(task._id);
    }
  }

  async updateRepeatEveryTaskJob(task) {
    await this.removeTaskJobs(task._id);
    if (task.status === taskStatus.RUNNING) {
      await this.createRepeatEveryTaskJob(task);
    }
  }

  //

  async removeTaskJobs(taskId) {
    const jobs = await this.agenda.jobs({ 'data.taskId': ObjectID(taskId) });
    if (jobs.length) {
      await Promise.all(jobs.map(async (job) => await job.remove()));
    }
  }

  async removeCameraJobs(cameraId) {
    const jobs = await this.agenda.jobs({ 'data.cameraId': ObjectID(cameraId) });
    if (jobs.length) {
      await Promise.all(jobs.map((job) => job.remove()));
    }
  }
}

const worker = new Worker();

export default worker;
