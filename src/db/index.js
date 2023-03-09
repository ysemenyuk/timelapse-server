import MongoDB from './mongo.db.js';

export default async (config) => {
  const db = new MongoDB();
  await db.connect(config);
  return {};
};
