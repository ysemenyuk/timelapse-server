import { Agenda } from 'agenda/es.js';
import mongodb from 'mongodb';
import jobs from './jobs/index.js';
import debug from 'debug';
import { taskType } from './utils/constants.js';

const { MongoClient } = mongodb;
const logger = debug('worker');

const dbUri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME;
const jobTypes = ['photosJobs', 'videosJobs'];

class Worker {
  constructor(socket) {
    this.socket = socket;
    this.mongoClient;
    this.agenda;
  }

  async start() {
    this.mongoClient = new MongoClient(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await this.mongoClient.connect();

    logger(`mongoClient successfully connect`);

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
    const { type } = task;

    const mapping = {
      [taskType.ONE_TIME]: this.oneTime,
      [taskType.REPEAT_EVERY]: this.repeatEvery,
      [taskType.REPEAT_AT]: this.repeatAt,
    };

    await mapping[type](task);
  }

  async removeAll(task) {
    const jobs = await this.agenda.jobs({ name: task.name, 'data.cameraId': task.camera });

    if (jobs.length) {
      await Promise.all(jobs.map((job) => job.remove()));
    }
  }

  async oneTime(task) {
    const job = this.agenda.create(task.name, {
      userId: task.user,
      cameraId: task.camera,
      taskId: task._id,
    });

    await job.save();
  }

  async repeatEvery(task) {
    const { settings } = task;

    const job = this.agenda.create(task.name, {
      userId: task.user,
      cameraId: task.camera,
      taskId: task._id,
    });

    job.repeatEvery(`${settings.interval} seconds`);

    await job.save();
  }

  async repeatAt(task) {
    const { settings } = task;

    const job = this.agenda.create(task.name, {
      userId: task.user,
      cameraId: task.camera,
      taskId: task._id,
    });

    job.repeatAt(settings.startTime);

    await job.save();
  }
}

export default Worker;
