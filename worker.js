import { Agenda } from 'agenda/es.js';
import mongodb from 'mongodb';
import jobs from './jobs/index.js';
import debug from 'debug';

const logger = debug('worker');

const dbUri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME;
const jobTypes = ['screenshotsJobs', 'videosJobs'];

export default async (io) => {
  const { MongoClient } = mongodb;

  const mongoClient = new MongoClient(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await mongoClient.connect();

  logger(`mongoClient successfully connect`);

  const agenda = new Agenda({ mongo: mongoClient.db(dbName) });

  jobTypes.forEach((type) => {
    jobs[type](agenda, io, logger);
  });

  await agenda.start();

  logger(`agenda successfully started`);

  // const jobs = await agenda.jobs();
  // console.log('agenda jobs', jobs);

  return agenda;
};
