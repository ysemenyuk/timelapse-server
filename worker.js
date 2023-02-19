import { Agenda } from 'agenda/es.js';
import mongodb from 'mongodb';
import jobs from './jobs/index.js';
import debug from 'debug';
import { taskName, taskStatus } from './utils/constants.js';

const { MongoClient } = mongodb;
const logger = debug('worker');

const dbUri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME;
const jobTypes = ['photosJobs', 'videosJobs'];

class Worker {
  constructor() {
    this.socket;
    this.mongoClient;
    this.agenda;
  }

  get name() {
    return this.agenda;
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
      jobs[type](this.agenda, this.socket, logger);
    });

    await this.agenda.start();

    logger(`agenda successfully started`);

    // const jobs = await agenda.jobs();
    // console.log('agenda jobs', jobs);
  }

  async create(task) {
    const { name } = task;

    const mapping = {
      [taskName.CREATE_PHOTO]: this.oneTimeJob.bind(this),
      [taskName.CREATE_VIDEO]: this.oneTimeJob.bind(this),
      [taskName.CREATE_PHOTOS_BY_TIME]: this.repeatEveryJob.bind(this),
      [taskName.CREATE_VIDEOS_BY_TIME]: this.repeatAtJob.bind(this),
    };

    await mapping[name](task);
  }

  async update(task) {
    const { name } = task;

    const mapping = {
      [taskName.CREATE_PHOTO]: this.oneTimeJob.bind(this),
      [taskName.CREATE_VIDEO]: this.oneTimeJob.bind(this),
      [taskName.CREATE_PHOTOS_BY_TIME]: this.repeatEveryJob.bind(this),
      [taskName.CREATE_VIDEOS_BY_TIME]: this.repeatAtJob.bind(this),
    };

    await mapping[name](task);
  }

  async removeJobs(task) {
    const jobs = await this.agenda.jobs({ name: task.name, 'data.cameraId': task.camera });

    if (jobs.length) {
      await Promise.all(jobs.map((job) => job.remove()));
    }
  }

  async oneTimeJob(task) {
    const jobs = await this.agenda.jobs({ 'data.taskId': task._id });

    if (jobs.length) {
      await Promise.all(jobs.map((job) => job.remove()));
    }

    const newJob = this.agenda.create(task.name, {
      userId: task.user,
      cameraId: task.camera,
      taskId: task._id,
    });

    await newJob.save();
  }

  async repeatEveryJob(task) {
    const { status, photoSettings } = task;

    const jobs = await this.agenda.jobs({ 'data.taskId': task._id });
    // console.log(5555, jobs.length);

    if (jobs.length > 0) {
      await Promise.all(jobs.map((job) => job.remove()));
    }

    // const jobs2 = await this.agenda.jobs({ 'data.taskId': task._id });
    // console.log(6666, jobs2.length);

    if (status !== taskStatus.RUNNING) {
      return;
    }

    const job = this.agenda.create(task.name, {
      userId: task.user,
      cameraId: task.camera,
      taskId: task._id,
    });

    job.repeatEvery(`${photoSettings.interval} seconds`);

    await job.save();
  }

  async repeatAtJob(task) {
    const { status, videoSettings } = task;

    if (status !== taskStatus.RUNNING) {
      return;
    }

    const job = this.agenda.create(task.name, {
      userId: task.user,
      cameraId: task.camera,
      taskId: task._id,
    });

    job.repeatAt(videoSettings.createTime);

    await job.save();
  }
}

const worker = new Worker();

export default worker;
