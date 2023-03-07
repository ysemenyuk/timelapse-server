import express from 'express';
import { cameraController } from '../controllers/index.js';
import { authMiddleware, cameraMiddleware } from '../middlewares/index.js';
import { cameraValidator } from '../validators/index.js';
import { asyncHandler } from '../utils/utils.js';

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
