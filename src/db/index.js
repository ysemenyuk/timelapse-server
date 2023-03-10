import MongoDB from './mongo.db.js';

import cameraRepo from './repos/camera.repo.js';
import dateInfoRepo from './repos/dateInfo.repo.js';
import fileRepo from './repos/file.repo.js';
import taskRepo from './repos/task.repo.js';
import userRepo from './repos/user.repo.js';

export default async (config) => {
  const db = new MongoDB();
  await db.connect(config);
  return { cameraRepo, dateInfoRepo, fileRepo, taskRepo, userRepo };
};
