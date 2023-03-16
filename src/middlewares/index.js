import getAuthMiddleware from './auth.middleware.js';
import getCameraMiddleware from './camera.middleware.js';
import getDebugMiddleware from './logger.middleware.js';
import getErrorHandlerMiddleware from './errorHandler.middleware.js';

export default (container) => {
  container.register('authMiddleware', (c) => getAuthMiddleware(c.userService));
  container.register('cameraMiddleware', (c) => getCameraMiddleware(c.cameraService));
  container.register('debugMiddleware', (c) => getDebugMiddleware(c.loggerService));
  container.register('errorHandlerMiddleware', () => getErrorHandlerMiddleware());
};
