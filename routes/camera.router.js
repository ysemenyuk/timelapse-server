import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import userCameraMiddleware from '../middleware/userCameraMiddleware.js';
import cameraValidator from '../validators/camera.validator.yup.js';
import { asyncHandler } from '../middleware/errorHandlerMiddleware.js';
import cameraController from '../controllers/camera.controller.js';

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);

// /api/cameras

router.get('/', asyncHandler(cameraController.getAll));
router.get('/:cameraId', userCameraMiddleware, asyncHandler(cameraController.getOne));

router.post('/', cameraValidator.validateCamera, asyncHandler(cameraController.createOne));

router.put(
  '/:cameraId',
  userCameraMiddleware,
  cameraValidator.validateCamera,
  asyncHandler(cameraController.updateOne)
);

router.delete('/:cameraId', userCameraMiddleware, asyncHandler(cameraController.deleteOne));

export default router;
