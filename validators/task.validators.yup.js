import * as yup from 'yup';
import { ValidateError } from '../middleware/errorHandlerMiddleware.js';

const validateTaskSchema = yup.object().shape({
  name: yup.mixed().oneOf(['CreatePhoto', 'CreateVideo', 'CreatePhotosByTime', 'CreateVideosByTime']).required(),
  type: yup.mixed().oneOf(['OneTime', 'RepeatEvery', 'RepeatAt']).required(),
});

const createPhotoTaskSchema = yup.object().shape({
  name: yup.mixed().oneOf(['CreatePhoto']).required(),
  type: yup.mixed().oneOf(['OneTime']).required(),
  settings: yup.object().shape({
    photoUrl: yup.string().url(),
  }),
});

const createVideoTaskSchema = yup.object().shape({
  name: yup.mixed().oneOf(['CreateVideo']).required(),
  type: yup.mixed().oneOf(['OneTime']).required(),
  settings: yup.object().shape({
    startDate: yup.date().required(),
    endDate: yup.date().required(),
    duration: yup.number().required().positive().integer(),
    fps: yup.number().required().positive().integer(),
  }),
});

const createPhotosByTimeTaskSchema = yup.object().shape({
  name: yup.mixed().oneOf(['CreatePhoto']).required(),
  type: yup.mixed().oneOf(['OneTime']).required(),
  settings: yup.object().shape({
    interval: yup.number().required().positive().integer(),
    startTime: yup.date().required(),
    stopTime: yup.date().required(),
  }),
});

const createVideosByTimeTaskSchema = yup.object().shape({
  name: yup.mixed().oneOf(['CreatePhoto']).required(),
  type: yup.mixed().oneOf(['OneTime']).required(),
  settings: yup.object().shape({
    startTime: yup.date().required(),
    duration: yup.number().required().positive().integer(),
    fps: yup.number().required().positive().integer(),
  }),
});

const mapping = {
  CreatePhoto: createPhotoTaskSchema,
  CreateVideo: createVideoTaskSchema,
  CreatePhotosByTime: createPhotosByTimeTaskSchema,
  CreateVideosByTime: createVideosByTimeTaskSchema,
};

const validateTask = async (req, res, next) => {
  // console.log('- validator createOne req.body -', req.body);
  try {
    await validateTaskSchema.validate(req.body.name);
    await mapping[req.body.name].validate(req.body);
  } catch (error) {
    console.log('- validateTask error -', error);

    next(new ValidateError('not valid payload', error.message));
    return;
  }

  next();
};

export default { validateTask };
