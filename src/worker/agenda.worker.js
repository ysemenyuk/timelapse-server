import { Agenda } from 'agenda/es.js';
import mongodb from 'mongodb';
import jobs from './jobs/jobs.js';
import debug from 'debug';
import { taskStatus } from '../utils/constants.js';

const { MongoClient, ObjectID } = mongodb;

const dbUri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME;

class Worker {
  constructor() {
    this.socket;
    this.logger;
    this.agenda;
  }

  async start(jobTypes, socket) {
    this.socket = socket;
    this.logger = debug('worker');

    const mongoClient = new MongoClient(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await mongoClient.connect();

    this.agenda = new Agenda({ mongo: mongoClient.db(dbName) });

    if (jobTypes.length) {
      jobTypes.forEach((type) => {
        this.agenda.define(type, async (job) => {
          const data = job.attrs.data;
          await jobs[type](data, this.socket, this.logger, this);
        });
      });

      await this.agenda.start();
      this.logger(`agenda successfully started`);

      const currentjobs = await this.agenda.jobs();
      this.logger(`agenda currentjobs: ${currentjobs.length}`);

      if (currentjobs.length) {
        // await Promise.all(currentjobs.map(async (job) => await job.remove()));
        // currentjobs.forEach((job) => {
        //   console.log(job.attrs);
        // });
      }
    }
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

  async createOneTimeTaskJob(task) {
    const job = this.createJob(task);
    await job.save();
  }

  async createRepeatEveryTaskJob(task, interval) {
    const job = this.createJob(task);
    await job.repeatEvery(interval).save();
  }

  createJob(task) {
    return this.agenda.create(task.name, {
      userId: task.user,
      cameraId: task.camera,
      taskId: task._id,
    });
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
      const interval = `${task.photoSettings.interval} seconds`;
      await this.createRepeatEveryTaskJob(task, interval);
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

export default Worker;