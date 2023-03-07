import express from 'express';
import { userController } from '../controllers/index.js';
import { userValidator } from '../validators/index.js';
import { authMiddleware } from '../middlewares/index.js';
import { asyncHandler } from '../utils/utils.js';

const router = express.Router();

router.post('/singup', userValidator.validateUser, asyncHandler(userController.singUp));
router.post('/login', userValidator.validateUser, asyncHandler(userController.logIn));

router.get('/auth', authMiddleware, asyncHandler(userController.auth));
router.get('/:userId', authMiddleware, asyncHandler(userController.getOne));

router.put('/:userId', authMiddleware, asyncHandler(userController.updateOne));

router.delete('/:userId', authMiddleware, asyncHandler(userController.deleteOne));

export default router;
