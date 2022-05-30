import * as yup from 'yup';
import { taskName, taskType } from '../utils/constants.js';

const { CREATE_PHOTO, CREATE_PHOTOS_BY_TIME, CREATE_VIDEO, CREATE_VIDEOS_BY_TIME } = taskName;
const { ONE_TIME, REPEAT_EVERY, REPEAT_AT } = taskType;

export const taskSchema = yup.object().shape({
  name: yup.mixed().oneOf([CREATE_PHOTO, CREATE_PHOTOS_BY_TIME, CREATE_VIDEO, CREATE_VIDEOS_BY_TIME]).required(),
  type: yup.mixed().oneOf([ONE_TIME, REPEAT_EVERY, REPEAT_AT]).required(),
});

const createPhotoTaskSchema = yup.object().shape({
  name: yup.mixed().oneOf([CREATE_PHOTO]).required(),
  type: yup.mixed().oneOf([ONE_TIME]).required(),
  settings: yup.object().shape({
    photoUrl: yup.string().url(),
  }),
});

const createVideoTaskSchema = yup.object().shape({
  name: yup.mixed().oneOf([CREATE_VIDEO]).required(),
  type: yup.mixed().oneOf([ONE_TIME]).required(),
  settings: yup.object().shape({
    startDate: yup.date().required(),
    endDate: yup.date().required(),
    duration: yup.number().required().positive().integer(),
    fps: yup.number().required().positive().integer(),
  }),
});

const createPhotosByTimeTaskSchema = yup.object().shape({
  name: yup.mixed().oneOf([CREATE_PHOTOS_BY_TIME]).required(),
  type: yup.mixed().oneOf([REPEAT_EVERY]).required(),
  settings: yup.object().shape({
    interval: yup.number().required().positive().integer(),
    startTime: yup.date().required(),
    stopTime: yup.date().required(),
  }),
});

const createVideosByTimeTaskSchema = yup.object().shape({
  name: yup.mixed().oneOf([CREATE_VIDEOS_BY_TIME]).required(),
  type: yup.mixed().oneOf([REPEAT_AT]).required(),
  settings: yup.object().shape({
    startTime: yup.date().required(),
    duration: yup.number().required().positive().integer(),
    fps: yup.number().required().positive().integer(),
  }),
});

export const taskSchemaByName = {
  [CREATE_PHOTO]: createPhotoTaskSchema,
  [CREATE_VIDEO]: createVideoTaskSchema,
  [CREATE_PHOTOS_BY_TIME]: createPhotosByTimeTaskSchema,
  [CREATE_VIDEOS_BY_TIME]: createVideosByTimeTaskSchema,
};
