import * as yup from 'yup';
import { ValidateError } from '../errors.js';

const createOneSchema = yup.string().url().required();

const validateUrl = async (url) => {
  // console.log('- validatePhotoUrl url -', url);

  try {
    await createOneSchema.validate(url);
  } catch (error) {
    console.log('- validatePhotoUrl error -', error);
    throw new ValidateError('not valid url', error.message);
  }
};

export default { validateUrl };
