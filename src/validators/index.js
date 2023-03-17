import userValidator from './user.validator.ajv.js';
import cameraValidator from './camera.validator.yup.js';
import taskValidator from './task.validator.yup.js';
import urlValidator from './url.validator.yup.js';

export default () => ({
  userValidator,
  cameraValidator,
  taskValidator,
  urlValidator,
});
