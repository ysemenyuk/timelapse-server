import { Agenda } from 'agenda/es.js';
import jobs from './jobs/index.js';

const jobTypes = process.env.JOB_TYPES ? process.env.JOB_TYPES.split(',') : [];

export default async (mongoClient, storage, io) => {
  const agenda = new Agenda({ mongo: mongoClient.db('timelapse') });

  agenda.processEvery('10 seconds');

  jobTypes.forEach((type) => {
    jobs[type](agenda, storage, io);
  });

  if (jobTypes.length) {
    await agenda.start();
  }

  // const { ObjectID } = mongodb;
  // const id = new ObjectID('61fd39591baa2821f1a4a508');

  // const jobs1 = await agenda.jobs({ _id: id });
  // console.log('Jobs1', jobs1);

  return agenda;
};

// const agenda = new Agenda({ db: { adress: dbUri, options: {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
//  } }});

// agenda.define('console1', { lockLifetime: 10000 }, (job) => {
//   console.log(111111, new Date().toISOString(), job.attrs);
// });

// agenda.define("console2", { lockLifetime: 10000 }, (job) => {
//   console.log(222222)
// });

// const job = agenda.create('console1', { cameraId: 1 });
// job.repeatEvery('10 seconds');
// await job.save();

// const job2 = agenda.create('console1', { cameraId: 2 });
// job2.repeatEvery('15 seconds');
// await job2.save();

// console.log("Job successfully saved");

// await agenda.every("10 seconds", "console1", {cameraId: 1});
// await agenda.every("15 seconds", "console1", {cameraId: 2});

// await agenda.every("15 seconds", "console2");

// agenda
// .on("start", (job) => {
//   console.log(`Job ${job.attrs.name} starting`);
// })
// .on("complete", (job) => {
//   console.log(`Job ${job.attrs.name} finished`);
// });

// export default initWorker;
