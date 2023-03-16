// import _ from 'lodash';
import getStorageService from './storageService/index.js';
import WorkerService from './workerService/worker.service.js';
import SocketService from './socketService/socket.service.js';
import LoggerService from './logger.service.js';

import TaskService from './task.service.js';
import UserService from './user.service.js';
import CameraService from './camera.service.js';
import FileService from './file.service.js';
import DateInfoService from './dateInfo.service.js';

import fsService from './fs.service.js';
import httpService from './http.service.js';
import imageService from './image.service.js';
import videoService from './video.service.js';
import WeatherService from './weather.service.js';

export default async (c) => {
  c.register('storageService', (c) => getStorageService(c.loggerService, c.config));
  c.register('workerService', (c) => new WorkerService(c.loggerService));
  c.register('socketService', (c) => new SocketService(c.loggerService));

  c.register('userService', (c) => new UserService(c.userRepo, c.config));
  c.register('cameraService', (c) => new CameraService(c.cameraRepo, c.taskService, c.fileService));
  c.register('taskService', (c) => new TaskService(c.taskRepo, c.workerService));
  c.register('fileService', (c) => new FileService(c.fileRepo, c.storageService));
  c.register('dateInfoService', (c) => new DateInfoService(c.dateInfoRepo));

  c.register('loggerService', () => new LoggerService());
  c.register('weatherService', (c) => new WeatherService(c.httpService, c.config));

  c.register('fsService', () => fsService);
  c.register('httpService', () => httpService);
  c.register('imageService', () => imageService);
  c.register('videoService', () => videoService);
};
