import _ from 'lodash';
import cameraRouter from './camera.router.js';
import taskRouter from './task.router.js';

const routers = { cameraRouter, taskRouter };

export default (controllers, middlewares, validators) => {
  const container = {};
  _.forEach(routers, (name, getRouter) => _.set(container, name, getRouter(controllers, middlewares, validators)));
  return container;
};
