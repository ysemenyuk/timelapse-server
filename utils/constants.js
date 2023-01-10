export const THUMBNAIL_SIZE = 200;

// file type
export const fileType = {
  FOLDER: 'folder',
  PHOTO_BY_HAND: 'photoByHand',
  PHOTO_BY_TIME: 'photoByTime',
  VIDEO_BY_HAND: 'videoByHand',
  VIDEO_BY_TIME: 'videoByTime',
};

// folders
export const folderName = {
  MAIN: 'Main',
  PHOTOS_BY_HAND: 'PhotosByHand',
  PHOTOS_BY_TIME: 'PhotosByTime',
  VIDEOS_BY_HAND: 'VideosByHand',
  VIDEOS_BY_TIME: 'VideosByTime',
};

// tasks
export const taskName = {
  CREATE_PHOTO_BY_HAND: 'CreatePhotoByHand',
  CREATE_VIDEO_BY_HAND: 'CreateVideoByHand',
  CREATE_PHOTOS_BY_TIME: 'CreatePhotosByTime',
  CREATE_VIDEOS_BY_TIME: 'CreateVideosByTime',
};

export const taskType = {
  ONE_TIME: 'OneTime',
  REPEAT_EVERY: 'RepeatEvery',
  REPEAT_AT: 'RepeatAt',
};

export const taskStatus = {
  CREATED: 'Created',
  READY: 'Ready',
  RUNNING: 'Running',
  STOPPED: 'Stopped',
  SUCCESSED: 'Successed',
  FAILED: 'Failed',
  CANCELED: 'Canceled',
};
