// import _ from 'lodash';
import initStorageService from './storageService/index.js';
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

export default async (container) => {
  container.register('storageService', (container) => initStorageService(container));
  container.register('workerService', (container) => new WorkerService(container));
  container.register('socketService', (container) => new SocketService(container));
  container.register('loggerService', (container) => new LoggerService(container));

  container.register('taskService', (container) => new TaskService(container));
  container.register('userService', (container) => new UserService(container));
  container.register('cameraService', (container) => new CameraService(container));
  container.register('fileService', (container) => new FileService(container));
  container.register('dateInfoService', (container) => new DateInfoService(container));

  container.register('weatherService', (container) => new WeatherService(container));
  container.register('fsService', () => fsService);
  container.register('httpService', () => httpService);
  container.register('imageService', () => imageService);
  container.register('videoService', () => videoService);
};
