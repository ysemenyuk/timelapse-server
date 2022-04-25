import cameraController from './camera.controller.js';
import cameraFileController from './cameraFile.controller.js';
import cameraTaskController from './cameraTask.controller.js';
import userController from './user.controller.js';

export default () => {
  const constrollers = {
    camera: cameraController,
    cameraFile: cameraFileController,
    cameraTask: cameraTaskController,
    user: userController,
  };

  return constrollers;
};
