import MongoDB from './mongo.db.js';

import userRepo from './repos/user.repo.js';
import taskRepo from './repos/task.repo.js';
import cameraRepo from './repos/camera.repo.js';
import fileRepo from './repos/file.repo.js';
import dateInfoRepo from './repos/dateInfo.repo.js';

export { userRepo, taskRepo, cameraRepo, fileRepo, dateInfoRepo };

export default MongoDB;
