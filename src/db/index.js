import MongoDB from './mongo.db.js';
import UserRepo from './repos/user.repo.js';
import CameraRepo from './repos/camera.repo.js';
import TaskRepo from './repos/task.repo.js';
import FileRepo from './repos/file.repo.js';
import DateInfoRepo from './repos/dateInfo.repo.js';

export default (c) => {
  c.register('db', () => new MongoDB());

  c.register('userRepo', () => new UserRepo());
  c.register('cameraRepo', () => new CameraRepo());
  c.register('taskRepo', () => new TaskRepo());
  c.register('fileRepo', () => new FileRepo());
  c.register('dateInfoRepo', () => new DateInfoRepo());
};
