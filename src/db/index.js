import MongoDB from './mongo.db.js';
import userRepo from './repos/user.repo.js';
import taskRepo from './repos/task.repo.js';

const db = new MongoDB();

export { userRepo, taskRepo };

export default db;
