import * as yup from 'yup';
import { ValidateError } from '../middleware/errorHandlerMiddleware.js';

const createOneSchema = yup.object({
  name: yup.string().required(),
  description: yup.string().required(),
  photoUrl: yup.string().url(),
});

const validateCamera = async (req, res, next) => {
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
