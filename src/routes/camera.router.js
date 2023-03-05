import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import cameraMiddleware from '../middleware/cameraMiddleware.js';
import cameraValidator from '../validators/camera.validator.yup.js';
import { asyncHandler } from '../middleware/errorHandlerMiddleware.js';
import cameraController from '../controllers/camera.controller.js';

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);

// /api/cameras

router.get('/', asyncHandler(cameraController.getAll));
router.get('/:cameraId', cameraMiddleware, asyncHandler(cameraController.getOne));
router.get('/:cameraId/stats', cameraMiddleware, asyncHandler(cameraController.getCameraStats));

router.post('/', cameraValidator.validateCamera, asyncHandler(cameraController.createOne));

router.put('/:cameraId', cameraMiddleware, cameraValidator.validateCamera, asyncHandler(cameraController.updateOne));

router.delete('/:cameraId', cameraMiddleware, asyncHandler(cameraController.deleteOne));

export default router;
