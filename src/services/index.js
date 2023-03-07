// import _ from 'lodash';
import config from '../config.js';
import initStorageService from './storageService/index.js';
import initWorkerService from './workerService/index.js';
import TaskService from './task.service.js';
import UserService from './user.service.js';

export default async (repos) => {
  const storageService = await initStorageService(config);
  const workerService = await initWorkerService(config);

  const container = {
    storageService,
    workerService,
    taskService: new TaskService(repos.taskRepo),
    userService: new UserService(repos.userRepo),
  };

  container.taskService.inject(container.workerService);
  container.userService.inject(container.fileService);

  return container;
};
