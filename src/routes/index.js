// import _ from 'lodash';
import getUserRouter from './user.router.js';
import getTaskRouter from './task.router.js';
import getCameraRouter from './camera.router.js';
import getDateInfoRouter from './dateInfo.router.js';
import getFileRouter from './file.router.js';
import getStorageRouter from './storage.router.js';

export default (controllers, middlewares, validators, services) => {
  const container = {
    userRouter: getUserRouter(controllers, middlewares, validators),
    taskRouter: getTaskRouter(controllers, middlewares, validators),
    cameraRouter: getCameraRouter(controllers, middlewares, validators),
    dateInfoRouter: getDateInfoRouter(controllers, middlewares),
    fileRouter: getFileRouter(controllers, middlewares),
    storageRouter: getStorageRouter(services),
  };

  return container;
};
