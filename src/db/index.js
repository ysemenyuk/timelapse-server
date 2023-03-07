import MongoDB from './mongo.db.js';

export default async (config) => {
  const db = new MongoDB();
  const repos = await db.connect(config);
  return { db, repos };
};
