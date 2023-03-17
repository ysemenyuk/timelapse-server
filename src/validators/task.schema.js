import * as yup from 'yup';
import { taskName, taskType } from '../utils/constants.js';

const { CREATE_PHOTO, CREATE_PHOTOS_BY_TIME, CREATE_VIDEO, CREATE_VIDEOS_BY_TIME } = taskName;
const { ONE_TIME, REPEAT_EVERY } = taskType;

export const taskNameSchema = yup
  .mixed()
  .oneOf([CREATE_PHOTO, CREATE_PHOTOS_BY_TIME, CREATE_VIDEO, CREATE_VIDEOS_BY_TIME])
  .required();

const createPhotoTaskSchema = yup.object().shape({
  name: yup.mixed().oneOf([CREATE_PHOTO]).required(),
  type: yup.mixed().oneOf([ONE_TIME]).required(),
  photoSettings: yup.object().shape({
    photoUrl: yup.string().url(),
  }),
});

const createVideoTaskSchema = yup.object().shape({
  name: yup.mixed().oneOf([CREATE_VIDEO]).required(),
  type: yup.mixed().oneOf([ONE_TIME]).required(),
  videoSettings: yup.object().shape({
    customName: yup.string(),
    dateRanageType: yup.string().required(),
    startDate: yup.string().required(),
    endDate: yup.string().required(),
    timeRangeType: yup.string().required(),
    startTime: yup.string(),
    endTime: yup.string(),
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
    timeRangeType: yup.string().required(),
    startTime: yup.string().required(),
    endTime: yup.string().required(),
  }),
});

const createVideosByTimeTaskSchema = yup.object().shape({
  name: yup.mixed().oneOf([CREATE_VIDEOS_BY_TIME]).required(),
  type: yup.mixed().oneOf([REPEAT_EVERY]).required(),
  videoSettings: yup.object().shape({
    dateRangeType: yup.mixed().oneOf(['allDates', 'customDates']).required(),
    dateRange: yup.mixed().oneOf(['lastDay', 'lastWeek', 'lastMonth']),
    timeRangeType: yup.mixed().oneOf(['allTime', 'customTime']).required(),
    startTime: yup.string(),
    endTime: yup.string(),
    interval: yup.mixed().oneOf(['oneTimeMonth', 'oneTimeWeek', 'oneTimeDay']).required(),
    duration: yup.number().required().min(10),
    fps: yup.number().required().max(30),
    deletExistingFile: yup.mixed().oneOf(['yes', 'no']).required(),
  }),
});

export const taskSchemaByName = {
  [CREATE_PHOTO]: createPhotoTaskSchema,
  [CREATE_VIDEO]: createVideoTaskSchema,
  [CREATE_PHOTOS_BY_TIME]: createPhotosByTimeTaskSchema,
  [CREATE_VIDEOS_BY_TIME]: createVideosByTimeTaskSchema,
};
