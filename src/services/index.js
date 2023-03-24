// import GridfsStorage from './storageService/gridfs.storage.js';
import DiskStorage from './storageService/disk.storage.js';
import WorkerService from './workerService/worker.service.js';
import SocketService from './socketService/socket.service.js';
import LoggerService from './logger.service.js';

import TaskService from './task.service.js';
import UserService from './user.service.js';
import CameraService from './camera.service.js';
import FileService from './file.service.js';
import DateInfoService from './dateInfo.service.js';

import WeatherService from './weather.service.js';
import fsService from './fs.service.js';
import httpService from './http.service.js';
import imageService from './image.service.js';
import videoService from './video.service.js';

class Container {
  constructor() {
    this.services = {};
  }

  add(name, cb) {
    Object.defineProperty(this, name, {
      get: () => {
        // eslint-disable-next-line no-prototype-builtins
        if (!this.services.hasOwnProperty(name)) {
          this.services[name] = cb(this);
        }

        return this.services[name];
      },
      configurable: true,
      enumerable: true,
    });

    return this;
  }
}

export default (config, repos) => {
  const c = new Container();

  // c.add('storageService', (c) => new GridfsStorage(c.loggerService));
  c.add('storageService', (c) => new DiskStorage(c.loggerService));
  c.add('workerService', (c) => new WorkerService(c.loggerService));
  c.add('socketService', (c) => new SocketService(c.loggerService));
  c.add('loggerService', () => new LoggerService());

  c.add('userService', () => new UserService(repos.userRepo, c.fileService, config));
  c.add('cameraService', (c) => new CameraService(repos.cameraRepo, c.taskService, c.fileService));
  c.add('taskService', (c) => new TaskService(repos.taskRepo, c.workerService));
  c.add('fileService', (c) => new FileService(repos.fileRepo, c.storageService));
  c.add('dateInfoService', () => new DateInfoService(repos.dateInfoRepo));

  c.add('weatherService', (c) => new WeatherService(c.httpService, config));
  c.add('fsService', () => fsService);
  c.add('httpService', () => httpService);
  c.add('imageService', () => imageService);
  c.add('videoService', () => videoService);

  return {
    storageService: c.storageService,
    workerService: c.workerService,
    socketService: c.socketService,
    loggerService: c.loggerService,

    userService: c.userService,
    cameraService: c.cameraService,
    taskService: c.taskService,
    fileService: c.fileService,
    dateInfoService: c.dateInfoService,

    weatherService: c.weatherService,
    fsService: c.fsService,
    httpService: c.httpService,
    imageService: c.imageService,
    videoService: c.videoService,
  };
};
