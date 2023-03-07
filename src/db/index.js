import _ from 'lodash';
import MongoDB from './mongo.db.js';
import userRepo from './repos/user.repo.js';
import taskRepo from './repos/task.repo.js';

const repos = { userRepo, taskRepo };

export default async () => {
  const db = new MongoDB();
  await db.connect();

  const c = new Map();
  _.forEach(repos, (name, repo) => c.set(name, repo));
  return c;
};
