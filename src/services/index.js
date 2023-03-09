// import _ from 'lodash';
import config from '../config.js';
import initStorageService from './storageService/index.js';
import initWorkerService from './workerService/index.js';
// import initSocketService from './socketService/index.js';
import TaskService from './task.service.js';
import UserService from './user.service.js';
import CameraService from './camera.service.js';
import FileService from './file.service.js';
import DateInfoService from './dateInfo.service.js';
import fsService from './fs.service.js';
import httpService from './http.service.js';
import imageService from './image.service.js';
import videoService from './video.service.js';
import weatherService from './weather.service.js';

export default async (repos) => {
  const storageService = await initStorageService(config);
  const workerService = await initWorkerService(config);
  // const socketService = initSocketService(config);

  const container = {
    storageService,
    workerService,
    // socketService,
    taskService: new TaskService(repos.taskRepo),
    userService: new UserService(repos.userRepo),
    cameraService: new CameraService(repos.cameraRepo),
    fileService: new FileService(repos.fileRepo),
    dateInfoService: new DateInfoService(repos.dateInfoRepo),
    fsService,
    httpService,
    imageService,
    videoService,
    weatherService,
  };

  container.taskService.inject(container.workerService);
  container.userService.inject(container.fileService);
  // ..

  return container;
};
