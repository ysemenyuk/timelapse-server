import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import cameraMiddleware from '../middlewares/camera.middleware.js';
import { asyncHandler } from '../middlewares/errorHandler.middleware.js';
import taskController from '../controllers/task.controller.js';
import taskValidator from '../validators/task.validator.yup.js';

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);
router.use(cameraMiddleware);

// /api/cameras/:cameraId/tasks

router.get('/', asyncHandler(taskController.getAll));
router.get('/:taskId', asyncHandler(taskController.getOne));

router.post('/', taskValidator.validateTask, asyncHandler(taskController.createOne));

router.put('/:taskId', taskValidator.validateTask, asyncHandler(taskController.updateOne));

router.delete('/:taskId', asyncHandler(taskController.deleteOne));

export default router;
