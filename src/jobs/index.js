import { createPhotoJob, createPhotosByTimeJob } from './photos.jobs.js';
import { createVideoJob, createVideosByTimeJob } from './videos.jobs.js';
import { taskName } from '../utils/constants.js';

const { CREATE_PHOTO, CREATE_VIDEO, CREATE_PHOTOS_BY_TIME, CREATE_VIDEOS_BY_TIME } = taskName;

const jobsMap = {
  [CREATE_PHOTO]: createPhotoJob,
  [CREATE_VIDEO]: createVideoJob,
  [CREATE_PHOTOS_BY_TIME]: createPhotosByTimeJob,
  [CREATE_VIDEOS_BY_TIME]: createVideosByTimeJob,
};

export default (config, logger, services) => {
  if (!config.jobTypesToStart) {
    return {};
  }

  const jobsToStart = {};

  config.jobTypesToStart.forEach((jobName) => {
    jobsToStart[jobName] = jobsMap[jobName](services, logger);
  });

  return jobsToStart;
};
