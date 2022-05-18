import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import userCameraMiddleware from '../middleware/userCameraMiddleware.js';
import { asyncHandler } from '../middleware/errorHandlerMiddleware.js';
import cameraTaskController from '../controllers/cameraTask.controller.js';

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);
router.use(userCameraMiddleware);

router.get('/:taskId', asyncHandler(cameraTaskController.getOne));
router.get('/', asyncHandler(cameraTaskController.getAll));

router.post('/screenshot', asyncHandler(cameraTaskController.createScreenshotTask));
router.post('/', asyncHandler(cameraTaskController.createOne));

router.put('/:taskId/screenshotsByTime', asyncHandler(cameraTaskController.updateScreenshotsByTimeTask));
router.put('/:taskId', asyncHandler(cameraTaskController.updateOne));

router.delete('/:taskId', asyncHandler(cameraTaskController.deleteOne));

export default router;
