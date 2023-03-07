import _ from 'lodash';
import cameraController from './camera.controller.js';
import taskController from './task.controller.js';

const controllers = { cameraController, taskController };

export default (services) => {
  const container = {};
  _.forEach(controllers, (name, Controller) => _.set(container, name, new Controller(services)));
  return container;
};
