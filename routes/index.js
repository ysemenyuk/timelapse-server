import cameraRouter from './camera.router.js';
import cameraFileRouter from './cameraFile.router.js';
import cameraTaskRouter from './cameraTask.router.js';
import storageRouter from './storage.router.js';
import userRouter from './user.router.js';

export default () => {
  return {
    camera: cameraRouter,
    cameraFile: cameraFileRouter,
    cameraTask: cameraTaskRouter,
    storage: storageRouter,
    user: userRouter,
  };
};
