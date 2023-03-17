// import _ from 'lodash';
import getUserRouter from './user.router.js';
import getCameraRouter from './camera.router.js';
import getTaskRouter from './task.router.js';
import getFileRouter from './file.router.js';
import getDateInfoRouter from './dateInfo.router.js';
import getStorageRouter from './storage.router.js';

export default (controllers, middlewares, validators) => {
  const { userController, cameraController, taskController, fileController, dateInfoController, storageController } =
    controllers;
  const { userValidator, cameraValidator, taskValidator } = validators;

  return {
    userRouter: getUserRouter(middlewares, userController, userValidator),
    cameraRouter: getCameraRouter(middlewares, cameraController, cameraValidator),
    taskRouter: getTaskRouter(middlewares, taskController, taskValidator),
    fileRouter: getFileRouter(middlewares, fileController),
    dateInfoRouter: getDateInfoRouter(middlewares, dateInfoController),
    storageRouter: getStorageRouter(middlewares, storageController),
  };
};
