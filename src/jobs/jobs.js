import { taskName } from '../utils/constants.js';
import { createPhotoJob, createPhotosByTimeJob } from './photos.jobs.js';
import { createVideoJob, createVideosByTimeJob } from './videos.jobs.js';

const jobs = {
  [taskName.CREATE_PHOTO]: createPhotoJob,
  [taskName.CREATE_VIDEO]: createVideoJob,
  [taskName.CREATE_PHOTOS_BY_TIME]: createPhotosByTimeJob,
  [taskName.CREATE_VIDEOS_BY_TIME]: createVideosByTimeJob,
};

export default jobs;
