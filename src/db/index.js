import MongoDB from './mongo.db.js';
import UserRepo from './repos/user.repo.js';
import CameraRepo from './repos/camera.repo.js';
import TaskRepo from './repos/task.repo.js';
import FileRepo from './repos/file.repo.js';
import DateInfoRepo from './repos/dateInfo.repo.js';

export default (container) => {
  container.register('db', (container) => new MongoDB(container));

  container.register('userRepo', (container) => new UserRepo(container));
  container.register('cameraRepo', (container) => new CameraRepo(container));
  container.register('taskRepo', (container) => new TaskRepo(container));
  container.register('fileRepo', (container) => new FileRepo(container));
  container.register('dateInfoRepo', (container) => new DateInfoRepo(container));
};
