// import _ from 'lodash';
import UserController from './user.controller.js';
import CameraController from './camera.controller.js';
import TaskController from './task.controller.js';
import FileController from './file.controller.js';
import DateInfoController from './dateInfo.controller.js';
import StorageController from './storage.controller.js';

export default (services) => ({
  userController: new UserController(services.userService),
  cameraController: new CameraController(services.cameraService),
  taskController: new TaskController(services.taskService),
  fileController: new FileController(services.fileService),
  dateInfoController: new DateInfoController(services.dateInfoService),
  storageController: new StorageController(services.storageService, services.imageService),
});
