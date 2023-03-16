// import _ from 'lodash';
import getUserRouter from './user.router.js';
import getCameraRouter from './camera.router.js';
import getTaskRouter from './task.router.js';
import getFileRouter from './file.router.js';
import getDateInfoRouter from './dateInfo.router.js';
import getStorageRouter from './storage.router.js';

export default (c) => {
  const middlewares = {
    authMiddleware: c.authMiddleware,
    cameraMiddleware: c.cameraMiddleware,
  };

  return {
    userRouter: getUserRouter(middlewares, c.userController, c.userValidator),
    cameraRouter: getCameraRouter(middlewares, c.cameraController, c.cameraValidator),
    taskRouter: getTaskRouter(middlewares, c.taskController, c.taskValidator),
    fileRouter: getFileRouter(middlewares, c.fileController),
    dateInfoRouter: getDateInfoRouter(middlewares, c.dateInfoController),

    storageRouter: getStorageRouter(c.config, c.storageService, c.imageService),
  };
};
