import getAuthMiddleware from './auth.middleware.js';
import getCameraMiddleware from './camera.middleware.js';
import getDebugMiddleware from './logger.middleware.js';
import getErrorHandlerMiddleware from './errorHandler.middleware.js';

export default (services) => ({
  authMiddleware: getAuthMiddleware(services.userService),
  cameraMiddleware: getCameraMiddleware(services.cameraService),
  debugMiddleware: getDebugMiddleware(services.loggerService),
  errorHandlerMiddleware: getErrorHandlerMiddleware(services.loggerService),
});
