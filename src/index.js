import 'dotenv/config';
import config from './config.js';
import MongoDB from './db/mongo.db.js';
import getRepos from './db/repos/index.js';
import getServices from './services/index.js';
import initServer from './server.js';

const start = async () => {
  const db = new MongoDB();
  const repos = getRepos();
  const services = getServices(config, repos);

  const logger = services.loggerService.create('server');
  const server = await initServer(config, logger, services, db);

  server.listen(config.port, () => {
    logger(`httpServer running in ${config.mode} mode on port ${config.port}`);
  });
};

//

start();
