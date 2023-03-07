// import _ from 'lodash';
import UserController from './user.controller.js';
import TaskController from './task.controller.js';

export default (services) => {
  const container = {
    userController: new UserController(services.userService),
    taskConroller: new TaskController(services.taskService),
  };

  return container;
};
