import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import { ValidateError } from '../middleware/errorHandlerMiddleware.js';

const ajv = new Ajv();
addFormats(ajv);

const singUpSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', format: 'password' },
  },
  required: ['email', 'password'],
};

const singUp = (req, res, next) => {
  // console.log('- user.validator singUp req.body -', req.body);
  const validate = ajv.compile(singUpSchema);
  const valid = validate(req.body);

  if (!valid) {
    // console.log('- singUpValidate.errors -', validate.errors);
    throw new ValidateError('not valid request', validate.errors);
  }

  next();
};

const logInSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', format: 'password' },
  },
  required: ['email', 'password'],
};

const logIn = (req, res, next) => {
  console.log('- validator logIn req.body -', req.body);
  const validate = ajv.compile(logInSchema);
  const valid = validate(req.body);

  if (!valid) {
    console.log('- logInValidate.errors -', validate.errors);
    throw new ValidateError('not valid request', validate.errors);
  }

  next();
};

export default { singUp, logIn };
