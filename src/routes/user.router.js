import express from 'express';
// import userController from '../controllers/user.controller.js';
// import authMiddleware from '../middleware/authMiddleware.js';
// import userValidator from '../validators/user.validator.ajv.js';
import { asyncHandler } from '../utils/utils.js';

export default ({ userController }, { authMiddleware }, { userValidator }) => {
  const router = express.Router();

  router.post('/singup', userValidator.validateUser, asyncHandler(userController.singUp));
  router.post('/login', userValidator.validateUser, asyncHandler(userController.logIn));

  router.get('/auth', authMiddleware, asyncHandler(userController.auth));
  router.get('/:userId', authMiddleware, asyncHandler(userController.getOne));

  router.put('/:userId', authMiddleware, asyncHandler(userController.updateOne));

  router.delete('/:userId', authMiddleware, asyncHandler(userController.deleteOne));

  return router;
};
