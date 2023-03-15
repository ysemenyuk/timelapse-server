import getAuthMiddleware from './auth.middleware.js';
import getCameraMiddleware from './camera.middleware.js';
import getDebugMiddleware from './logger.middleware.js';
import errorHandlerMiddleware from './errorHandler.middleware.js';

export default (container) => {
  container.register('authMiddleware', (container) => getAuthMiddleware(container));
  container.register('cameraMiddleware', (container) => getCameraMiddleware(container));
  container.register('debugMiddleware', (container) => getDebugMiddleware(container));
  container.register('errorHandlerMiddleware', () => errorHandlerMiddleware);
};
