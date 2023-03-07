import config from '../config.js';
import getStorageService from './storageService/index.js';
import WorkerService from './workerService/worker.service.js';
import SocketService from './socketService/socket.service.js';
import UserService from './user.service.js';
import TaskService from './task.service.js';
import CameraService from './camera.service.js';
import FileService from './file.service.js';
import DateInfoService from './dateInfo.service.js';
import fsService from './fs.service.js';
import httpService from './http.service.js';
import imageService from './image.service.js';
import videoService from './video.service.js';
import weatherService from './weather.service.js';

const StorageService = getStorageService(config.storageType);

export default {
  storageService: new StorageService(),
  workerService: new WorkerService(),
  socketService: new SocketService(),
  taskService: new TaskService(),
  userService: new UserService(),
  cameraService: new CameraService(),
  fileService: new FileService(),
  dateInfoService: new DateInfoService(),
  fsService,
  httpService,
  imageService,
  videoService,
  weatherService,
};
