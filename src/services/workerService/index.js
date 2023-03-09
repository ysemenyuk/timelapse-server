import WorkerService from './worker.service.js';

export default async (config) => {
  const worker = new WorkerService();
  await worker.init(config);
  return worker;
};
