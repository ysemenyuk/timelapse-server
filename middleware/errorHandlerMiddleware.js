const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequestError';
    this.status = '400';
  }
}

class ValidateError extends Error {
  constructor(message, errors) {
    super(message);
    this.name = 'ValidateError';
    this.status = '400';
    this.errors = errors;
  }
}

const errorHandlerMiddleware = (err, req, res) => {
  console.log(22222222, '- errorHandlerMiddleware err -', err);

  if (err instanceof BadRequestError) {
    return res.status(err.status).send({ message: err.message });
  }

  if (err instanceof ValidateError) {
    return res.status(err.status).send({ message: err.message, errors: err.errors });
  }

  return res.status(500).send({ message: err.message });
};

export { asyncHandler, errorHandlerMiddleware, BadRequestError, ValidateError };
