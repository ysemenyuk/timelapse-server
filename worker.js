import { Agenda } from 'agenda/es.js';
import mongodb from 'mongodb';
import jobs from './jobs/index.js';
import debug from 'debug';

// const logger = debug('worker');

const dbUri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME;
const jobTypes = ['screenshotsJobs', 'videosJobs'];

class Worker {
  constructor() {
    this.agenda;
    this.socket;
    this.logger = debug('worker');
  }

  async start(socket) {
    this.socket = socket;

    const { MongoClient } = mongodb;

    const mongoClient = new MongoClient(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await mongoClient.connect();

    this.logger(`mongoClient successfully connect`);

    this.agenda = new Agenda({ mongo: mongoClient.db(dbName) });

    jobTypes.forEach((type) => {
      jobs[type](this.agenda, this.socket, this.logger);
    });

    await this.agenda.start();

    this.logger(`agenda successfully started`);

    // const jobs = await agenda.jobs();
    // console.log('agenda jobs', jobs);
  }

  async removeAll(name, cameraId) {
    const jobs = await this.agenda.jobs({ name, 'data.cameraId': cameraId });
    if (jobs.length) {
      await Promise.all(jobs.map((job) => job.remove()));
    }
  }

  async oneTime(name, data) {
    const job = this.agenda.create(name, data);
    await job.save();
  }

  async repeatEvery(name, interval, data) {
    const job = this.agenda.create(name, data);
    job.repeatEvery(`${interval} seconds`);
    await job.save();
  }

  async repeatAt(name, startTime, data) {
    const job = this.agenda.create(name, data);
    job.repeatAt(startTime); //ex "3:30pm"
    await job.save();
  }
}

export default Worker;
