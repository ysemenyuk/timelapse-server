import userValidator from './user.validator.ajv.js';
import cameraValidator from './camera.validator.yup.js';
import taskValidator from './task.validator.yup.js';
import urlValidator from './url.validator.yup.js';

export default (container) => {
  container.register('userValidator', () => userValidator);
  container.register('cameraValidator', () => cameraValidator);
  container.register('taskValidator', () => taskValidator);
  container.register('urlValidator', () => urlValidator);
};
