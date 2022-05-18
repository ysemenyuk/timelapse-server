import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import userCameraMiddleware from '../middleware/userCameraMiddleware.js';
import { asyncHandler } from '../middleware/errorHandlerMiddleware.js';
import cameraFileController from '../controllers/cameraFile.controller.js';

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);
router.use(userCameraMiddleware);

// /api/cameras/:cameraId/files

router.get('/', asyncHandler(cameraFileController.getAll));
router.get('/:fileId', asyncHandler(cameraFileController.getOne));

router.post('/', asyncHandler(cameraFileController.createOne));

router.delete('/:fileId', asyncHandler(cameraFileController.deleteOne));

export default router;
