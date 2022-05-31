import { ValidateError } from '../middleware/errorHandlerMiddleware.js';
import { taskNameSchema, taskSchemaByName } from './task.schema.js';

const validateTask = async (req, res, next) => {
  console.log('- validator createOne req.body -', req.body);

  try {
    await taskNameSchema.validate(req.body.name);
    await taskSchemaByName[req.body.name].validate(req.body);
  } catch (error) {
    console.log('- validateTask error -', error);

    next(new ValidateError('not valid payload', error.message));
    return;
  }

  next();
};

export default { validateTask };
