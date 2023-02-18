import * as yup from 'yup';
import { ValidateError } from '../middleware/errorHandlerMiddleware.js';

const createOneSchema = yup.string().url().required();

export const validatePhotoUrl = async (url) => {
  console.log('- validatePhotoUrl url -', url);

  try {
    await createOneSchema.validate(url);
  } catch (error) {
    console.log('- validatePhotoUrl error -', error);
    throw new ValidateError('not valid url', error.message);
  }
};

// export default { validatePhotoUrl };
