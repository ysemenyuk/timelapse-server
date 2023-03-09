// import _ from 'lodash';
import CameraController from './camera.controller.js';
import DateInfoController from './dateInfo.controller.js';
import FileController from './file.controller.js';
import UserController from './user.controller.js';
import TaskController from './task.controller.js';

export default (services) => {
  const container = {
    cameraController: new CameraController(services.cameraService),
    dateInfoController: new DateInfoController(services.dateInfoService),
    fileController: new FileController(services.fileService),
    userController: new UserController(services.userService),
    taskConroller: new TaskController(services.taskService),
  };

  return container;
};
