class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequestError';
    this.status = 400;
  }
}

class ValidateError extends Error {
  constructor(message, errors) {
    super(message);
    this.name = 'ValidateError';
    this.status = 400;
    this.errors = errors;
  }
}

export { BadRequestError, ValidateError };
