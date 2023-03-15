// import _ from 'lodash';
import UserController from './user.controller.js';
import CameraController from './camera.controller.js';
import TaskController from './task.controller.js';
import FileController from './file.controller.js';
import DateInfoController from './dateInfo.controller.js';

export default (container) => {
  container.register('userController', (container) => new UserController(container));
  container.register('cameraController', (container) => new CameraController(container));
  container.register('taskController', (container) => new TaskController(container));
  container.register('fileController', (container) => new FileController(container));
  container.register('dateInfoController', (container) => new DateInfoController(container));
};
