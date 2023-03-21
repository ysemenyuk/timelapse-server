import { BadRequestError, ValidateError } from '../errors.js';

// eslint-disable-next-line no-unused-vars
export default (loggerService) => (err, req, res, next) => {
  console.log('- errorHandlerMiddleware err -', err);

  if (err instanceof BadRequestError) {
    return res.status(err.status).send({ message: err.message });
  }

  if (err instanceof ValidateError) {
    return res.status(err.status).send({ message: err.message, errors: err.errors });
  }

  return res.status(500).send({ message: 'Server error' });
};
