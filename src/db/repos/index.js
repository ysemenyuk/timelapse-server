import UserRepo from './user.repo.js';
import CameraRepo from './camera.repo.js';
import TaskRepo from './task.repo.js';
import FileRepo from './file.repo.js';
import DateInfoRepo from './dateInfo.repo.js';

export default () => ({
  userRepo: new UserRepo(),
  cameraRepo: new CameraRepo(),
  taskRepo: new TaskRepo(),
  fileRepo: new FileRepo(),
  dateInfoRepo: new DateInfoRepo(),
});
