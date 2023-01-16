export const THUMBNAIL_SIZE = 200;

// type
export const type = {
  FOLDER: 'folder',
  PHOTO: 'photo',
  VIDEO: 'video',
};

// fileType
export const fileType = {
  IMAGE_JPG: 'image/jpg',
  IMAGE_PNG: 'image/png',
  VIDEO_MPEG: 'video/mpeg',
  VIDEO_MP4: 'video/mp4',
};

//fileCreateType
export const fileCreateType = {
  BY_HAND: 'byHand',
  BY_TIME: 'byTime',
};

// folderType
export const folderType = {
  DEFAULT: 'default',
  DATE: 'date',
};

// folders
export const folderName = {
  USER_FOLDER: 'UserFolder',
  CAMERA_FOLDER: 'CameraFolder',
  PHOTOS: 'Photos',
  VIDEOS: 'Videos',
};

// tasks
export const taskName = {
  CREATE_PHOTO: 'CreatePhoto',
  CREATE_VIDEO: 'CreateVideo',
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
