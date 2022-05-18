import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import userCameraMiddleware from '../middleware/userCameraMiddleware.js';
import cameraValidator from '../validators/camera.validators.ajv.js';
import { asyncHandler } from '../middleware/errorHandlerMiddleware.js';
import cameraController from '../controllers/camera.controller.js';

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);

router.get('/', asyncHandler(cameraController.getAll));
router.get('/:cameraId', userCameraMiddleware, asyncHandler(cameraController.getOne));

router.post('/', cameraValidator.createOne, asyncHandler(cameraController.createOne));

router.put('/:cameraId', userCameraMiddleware, cameraValidator.updateOne, asyncHandler(cameraController.updateOne));

router.delete('/:cameraId', userCameraMiddleware, asyncHandler(cameraController.deleteOne));

export default router;
