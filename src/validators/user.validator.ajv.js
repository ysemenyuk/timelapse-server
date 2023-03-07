import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { ValidateError } from '../errors.js';

const ajv = new Ajv();
addFormats(ajv);

const userSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', format: 'password' },
  },
  required: ['email', 'password'],
};

const validateUser = (req, res, next) => {
  // console.log('- validator logIn req.body -', req.body);

  const validate = ajv.compile(userSchema);
  const valid = validate(req.body);

  if (!valid) {
    console.log('- logInValidate.errors -', validate.errors);
    next(ValidateError('not valid request', validate.errors));
    return;
  }

  next();
};

export default { validateUser };
