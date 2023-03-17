import 'dotenv/config';
import config from './config.js';
import MongoDB from './db/mongo.db.js';
import getRepos from './db/repos/index.js';
import getServices from './services/index.js';
import startServer from './server.js';

const start = async () => {
  const db = new MongoDB();
  const repos = getRepos();
  const services = getServices(repos, config);

  await startServer(db, services, config);
};

//

start();
