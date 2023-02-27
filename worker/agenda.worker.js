import { Agenda } from 'agenda/es.js';
import mongodb from 'mongodb';
import jobs from './jobs/jobs.js';
import debug from 'debug';
import { taskName, taskStatus } from '../utils/constants.js';

const { MongoClient, ObjectID } = mongodb;
const logger = debug('worker');

const dbUri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME;
const jobTypes = [taskName.CREATE_PHOTO, taskName.CREATE_VIDEO, taskName.CREATE_PHOTOS_BY_TIME];

class Worker {
  constructor() {
    this.socket;
    this.mongoClient;
    this.agenda;
    this.createMap = {
      OneTime: this.createOneTimeJob.bind(this),
      RepeatEvery: this.createRepeatEveryJob.bind(this),
    };
  }

  async start(socket) {
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
        await jobs[type](data, this.socket, logger);
      });
    });

    await this.agenda.start();
    logger(`agenda successfully started`);

    const currentjobs = await this.agenda.jobs();
    logger(`agenda currentjobs: ${currentjobs.length}`);

    // if (currentjobs.length) {
    // await Promise.all(currentjobs.map(async (job) => await job.remove()));
    // currentjobs.forEach((job) => {
    //   console.log(job.attrs);
    // });
    // }
  }

  //

  async createTaskJob(task) {
    await this.removeTaskJobs(task.id);

    if (task.type === 'OneTime') {
      await this.createOneTimeJob(task);
    }
    if (task.type === 'RepeatEvery') {
      await this.createRepeatEveryJob(task);
    }
  }

  createJob(task) {
    return this.agenda.create(task.name, {
      userId: task.user,
      cameraId: task.camera,
      taskId: task._id,
    });
  }

  async createOneTimeJob(task) {
    const job = this.createJob(task);
    await job.save();
  }

  async createRepeatEveryJob(task) {
    const job = this.createJob(task);

    const interval = `${task.photoSettings.interval} seconds`;
    job.repeatEvery(interval);

    await job.save();
  }

  //

  async updateTaskJob(task) {
    if (task.type === 'OneTime') {
      await this.updateOnTimeJob(task);
    }
    if (task.type === 'RepeatEvery') {
      await this.updateRepeatEveryJob(task);
    }
  }

  async updateOnTimeJob(task) {
    if (task.status === taskStatus.CANCELED) {
      await this.removeTaskJobs(task._id);
    }
  }

  async updateRepeatEveryJob(task) {
    await this.removeTaskJobs(task._id);
    if (task.status === taskStatus.RUNNING) {
      await this.createRepeatEveryJob(task);
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
