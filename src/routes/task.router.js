import express from 'express';
import { taskController } from '../controllers/index.js';
import { taskValidator } from '../validators/index.js';
import { authMiddleware, cameraMiddleware } from '../middlewares/index.js';
import { asyncHandler } from '../utils/utils.js';

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
