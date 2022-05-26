import * as yup from 'yup';
import _ from 'lodash';
import { ValidateError } from '../middleware/errorHandlerMiddleware.js';

// const { videoSettings } = payload;
// const { startDateTime, endDateTime, duration, fps } = videoSettings;

const createVideoTaskSchema = yup.object().shape({
  name: yup.string().required(),
  type: yup.string().required(),
  videoSettings: yup.object().shape({
    startDateTime: yup.string().required(),
    endDateTime: yup.string().required(),
    duration: yup.number().required().positive().integer(),
    fps: yup.number().required().positive().integer(),
  }),
});

export const validateCreateVideoTaskPayload = async (payload) => {
  // console.log('- validator createOne req.body -', req.body);

  console.log(9999999999, _.pick(payload, ['videoSettings.startDateTime']));

  try {
    const ok = await createVideoTaskSchema.validate(payload);
    console.log(7777, ok);
  } catch (error) {
    console.log(8888, error);
    throw new ValidateError('not valid request', error.message);
  }
};

// export default { validateCreateVideoTaskPayload };
