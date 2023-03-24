import mongodb from 'mongodb';
import { Agenda } from 'agenda/es.js';
import { taskStatus } from '../../utils/constants.js';

const { MongoClient, ObjectID } = mongodb;

export default class WorkerService {
  constructor(loggerService) {
    this.loggerService = loggerService;
  }

  async init(config, sLogger) {
    const mongoClient = new MongoClient(config.dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await mongoClient.connect();

    this.agenda = new Agenda({ mongo: mongoClient.db(config.agendaDbName) });

    await this.agenda.start();
    sLogger(`workerService successfully started!`);

    const currentjobs = await this.agenda.jobs();
    sLogger(`workerService currentjobs: ${currentjobs.length}`);

    // if (currentjobs.length) {
    // await Promise.all(currentjobs.map(async (job) => await job.remove()));
    // currentjobs.forEach((job) => {
    //   console.log(job.attrs);
    // });
    // }
  }

  async startJobs(jobs, sLogger) {
    const jobTypesToStart = Object.keys(jobs);
    sLogger(`jobTypesToStart: ${jobTypesToStart}`);

    if (jobTypesToStart.length === 0) {
      sLogger(`no jobs to start!`);
      return;
    }

    jobTypesToStart.forEach((type) => {
      this.agenda.define(type, async (job) => {
        const data = job.attrs.data;
        await jobs[type](data);
      });
    });

    sLogger(`jobs successfully started!`);
  }

  //

  async createTaskJob(task) {
    await this.removeTaskJobs(task.id);

    if (task.type === 'OneTime') {
      await this.createOneTimeTaskJob(task);
    }
    if (task.type === 'RepeatEvery') {
      await this.createRepeatEveryTaskJob(task);
    }
  }

  async createOneTimeTaskJob(task) {
    const job = this.createJob(task);
    await job.save();
  }

  async createRepeatEveryTaskJob(task) {
    const job = this.createJob(task);
    const interval = this.getInterval(task);
    await job.repeatEvery(interval).save();
  }

  createJob(task) {
    return this.agenda.create(task.name, {
      userId: task.user,
      cameraId: task.camera,
      taskId: task._id,
    });
  }

  getInterval(task) {
    if (task.name === 'CreatePhotosByTime') {
      return `${task.photoSettings.interval} seconds`;
    }

    if (task.name === 'CreateVideosByTime') {
      const intervalMap = {
        oneTimeDay: '0 1 * * *', // At 01:00 AM, every day
        oneTimeWeek: '0 1 * * MON', // At 01:00 AM, one time in week (Monday)
        oneTimeMonth: '0 1 1 * *', // At 01:00 AM, one time in month (1st day)
      };

      return intervalMap[task.videoSettings.interval];
    }
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
