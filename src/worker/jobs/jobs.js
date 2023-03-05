import { taskName } from '../../utils/constants.js';
import { socketNotification } from './nitifications.jobs.js';
import { createPhotoJob, createPhotosByTimeJob } from './photos.jobs.js';
import { createVideoJob } from './videos.jobs.js';

const jobs = {
  [taskName.CREATE_PHOTO]: createPhotoJob,
  [taskName.CREATE_VIDEO]: createVideoJob,
  [taskName.CREATE_PHOTOS_BY_TIME]: createPhotosByTimeJob,
  socketNotification: socketNotification,
};

export default jobs;
