import * as yup from 'yup';
import { ValidateError } from '../errors.js';

const createOneSchema = yup.object({
  name: yup.string().required(),
  description: yup.string().required(),
  model: yup.string(),
  photoUrl: yup.string().url(),
  rtspUrl: yup.string(),
  location: yup.object().shape({
    // latitude: yup.number().positive(),
    // longitude: yup.number().positive(),
  }),
});

const validateCamera = async (req, res, next) => {
  // console.log('- validateCamera createOne req.body -', req.body);

  try {
    await createOneSchema.validate(req.body);
  } catch (error) {
    console.log('- validateCamera error -', error);
    next(new ValidateError('not valid payload', error.message));
    return;
  }

  next();
};

export default { validateCamera };
