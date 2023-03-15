import express from 'express';
import { asyncHandler } from '../utils/utils.js';

export default (container) => {
  const router = express.Router();

  const authMiddleware = container.authMiddleware;
  const userValidator = container.userValidator;
  const userController = container.userController;

  router.post('/singup', userValidator.validateUser, asyncHandler(userController.singUp.bind(userController)));
  router.post('/login', userValidator.validateUser, asyncHandler(userController.logIn.bind(userController)));

  router.get('/auth', authMiddleware, asyncHandler(userController.auth.bind(userController)));
  router.get('/:userId', authMiddleware, asyncHandler(userController.getOne.bind(userController)));

  router.put('/:userId', authMiddleware, asyncHandler(userController.updateOne.bind(userController)));

  router.delete('/:userId', authMiddleware, asyncHandler(userController.deleteOne.bind(userController)));

  return router;
};
