import getAuthMiddleware from './auth.middleware.js';
import getCameraMiddelware from './camera.middleware.js';
import debugMiddleware from './debug.middleware.js';
import errorHandlerMiddleware from './errorHandler.middleware.js';
import winstonMiddleware from './winston.middleware.js';

export default (services) => {
  return {
    authMiddleware: getAuthMiddleware(services.userService),
    cameraMiddelware: getCameraMiddelware(services.cameraService),
    debugMiddleware,
    errorHandlerMiddleware,
    winstonMiddleware,
  };
};
