// import _ from 'lodash';
import getUserRouter from './user.router.js';
import getCameraRouter from './camera.router.js';
import getTaskRouter from './task.router.js';
import getFileRouter from './file.router.js';
import getDateInfoRouter from './dateInfo.router.js';
import getStorageRouter from './storage.router.js';

export default (container) => {
  return {
    userRouter: getUserRouter(container),
    cameraRouter: getCameraRouter(container),
    taskRouter: getTaskRouter(container),
    fileRouter: getFileRouter(container),
    dateInfoRouter: getDateInfoRouter(container),
    storageRouter: getStorageRouter(container),
  };
};
