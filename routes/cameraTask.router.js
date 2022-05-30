import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import userCameraMiddleware from '../middleware/userCameraMiddleware.js';
import { asyncHandler } from '../middleware/errorHandlerMiddleware.js';
import cameraTaskController from '../controllers/cameraTask.controller.js';
import cameraTaskValidator from '../validators/task.validators.yup.js';

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);
router.use(userCameraMiddleware);

// /api/cameras/:cameraId/tasks

router.get('/', asyncHandler(cameraTaskController.getAll));
router.get('/:taskId', asyncHandler(cameraTaskController.getOne));

router.post('/', cameraTaskValidator.validateTask, asyncHandler(cameraTaskController.createOne));

router.put('/:taskId', cameraTaskValidator.validateTask, asyncHandler(cameraTaskController.updateOne));

router.delete('/:taskId', asyncHandler(cameraTaskController.deleteOne));

export default router;
