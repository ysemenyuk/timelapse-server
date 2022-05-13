import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/errorHandlerMiddleware.js';
import userValidator from '../validators/user.validators.ajv.js';

export default (userController) => {
  const router = express.Router();

  router.post('/singup', userValidator.singUp, asyncHandler(userController.singUp));
  router.post('/login', userValidator.logIn, asyncHandler(userController.logIn));

  router.get('/auth', authMiddleware, asyncHandler(userController.auth));
  router.get('/:userId', authMiddleware, asyncHandler(userController.getOne));

  router.put('/:userId', authMiddleware, asyncHandler(userController.updateOne));

  router.delete('/:userId', authMiddleware, asyncHandler(userController.deleteOne));

  return router;
};
