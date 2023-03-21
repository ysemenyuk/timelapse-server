import { createPhotoJob, createPhotosByTimeJob } from './photos.jobs.js';
import { createVideoJob, createVideosByTimeJob } from './videos.jobs.js';
import { taskName } from '../utils/constants.js';

const { CREATE_PHOTO, CREATE_VIDEO, CREATE_PHOTOS_BY_TIME, CREATE_VIDEOS_BY_TIME } = taskName;

export default (services, jobTypesToStart, logger) => {
  // logger(`jobTypesToStart: ${jobTypesToStart}`);

  return {
    [CREATE_PHOTO]: createPhotoJob(services, logger),
    [CREATE_VIDEO]: createVideoJob(services, logger),
    [CREATE_PHOTOS_BY_TIME]: createPhotosByTimeJob(services, logger),
    [CREATE_VIDEOS_BY_TIME]: createVideosByTimeJob(services, logger),
  };
};
