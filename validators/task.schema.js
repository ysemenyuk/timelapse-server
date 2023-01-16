import * as yup from 'yup';
import { taskName, taskType } from '../utils/constants.js';

const { CREATE_PHOTO, CREATE_PHOTOS_BY_TIME, CREATE_VIDEO, CREATE_VIDEOS_BY_TIME } = taskName;
const { ONE_TIME, REPEAT_EVERY, REPEAT_AT } = taskType;

export const taskNameSchema = yup
  .mixed()
  .oneOf([CREATE_PHOTO, CREATE_PHOTOS_BY_TIME, CREATE_VIDEO, CREATE_VIDEOS_BY_TIME])
  .required();

const createPhotoByHandTaskSchema = yup.object().shape({
  name: yup.mixed().oneOf([CREATE_PHOTO]).required(),
  type: yup.mixed().oneOf([ONE_TIME]).required(),
  photoSettings: yup.object().shape({
    photoUrl: yup.string().url(),
  }),
});

const createVideoByHandTaskSchema = yup.object().shape({
  name: yup.mixed().oneOf([CREATE_VIDEO]).required(),
  type: yup.mixed().oneOf([ONE_TIME]).required(),
  videoSettings: yup.object().shape({
    startDate: yup.string().required(),
    endDate: yup.string().required(),
    duration: yup.number().required().positive().integer(),
    fps: yup.number().required().positive().integer(),
  }),
});

const createPhotosByTimeTaskSchema = yup.object().shape({
  name: yup.mixed().oneOf([CREATE_PHOTOS_BY_TIME]).required(),
  type: yup.mixed().oneOf([REPEAT_EVERY]).required(),
  photoSettings: yup.object().shape({
    photoUrl: yup.string().url(),
    interval: yup.number().required().positive().integer(),
    startTime: yup.string().required(),
    stopTime: yup.string().required(),
  }),
});

const createVideosByTimeTaskSchema = yup.object().shape({
  name: yup.mixed().oneOf([CREATE_VIDEOS_BY_TIME]).required(),
  type: yup.mixed().oneOf([REPEAT_AT]).required(),
  videoSettings: yup.object().shape({
    startTime: yup.string().required(),
    duration: yup.number().required().positive().integer(),
    fps: yup.number().required().positive().integer(),
  }),
});

export const taskSchemaByName = {
  [CREATE_PHOTO]: createPhotoByHandTaskSchema,
  [CREATE_VIDEO]: createVideoByHandTaskSchema,
  [CREATE_PHOTOS_BY_TIME]: createPhotosByTimeTaskSchema,
  [CREATE_VIDEOS_BY_TIME]: createVideosByTimeTaskSchema,
};
