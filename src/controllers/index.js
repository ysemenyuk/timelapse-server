// import _ from 'lodash';
import UserController from './user.controller.js';
import CameraController from './camera.controller.js';
import TaskController from './task.controller.js';
import FileController from './file.controller.js';
import DateInfoController from './dateInfo.controller.js';

export default (c) => {
  c.register('userController', (c) => new UserController(c.userService));
  c.register('cameraController', (c) => new CameraController(c.cameraService));
  c.register('taskController', (c) => new TaskController(c.taskService));
  c.register('fileController', (c) => new FileController(c.fileService));
  c.register('dateInfoController', (c) => new DateInfoController(c.dateInfoService));
};
