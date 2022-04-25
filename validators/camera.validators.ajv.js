import Ajv from 'ajv';
import { ValidateError } from '../middleware/errorHandlerMiddleware.js';

const ajv = new Ajv();

const createOneSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
  },
  required: ['name', 'description'],
};

const createOne = (req, res, next) => {
  console.log('- validator createOne req.body -', req.body);

  const validate = ajv.compile(createOneSchema);
  const valid = validate(req.body);

  if (!valid) {
    // console.log('- validate.errors -', validate.errors);
    throw new ValidateError('not valid request', validate.errors);
  }

  next();
};

const updateOneSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
  },
};

const updateOne = (req, res, next) => {
  // console.log('- validator updateOne req.body -', req.body);
  const validate = ajv.compile(updateOneSchema);
  const valid = validate(req.body);

  if (!valid) {
    // console.log('- validate.errors -', validate.errors);
    throw new ValidateError('not valid request', validate.errors);
  }

  next();
};

export default { createOne, updateOne };
