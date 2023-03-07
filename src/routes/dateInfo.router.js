import express from 'express';
import dateInfoController from '../controllers/dateInfo.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import cameraMiddleware from '../middlewares/camera.middleware.js';
import { asyncHandler } from '../middlewares/errorHandler.middleware.js';

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);
router.use(cameraMiddleware);

// /api/cameras/:cameraId/dateInfo/

router.get('/', asyncHandler(dateInfoController.getAll));
router.get('/:date', asyncHandler(dateInfoController.getOne));

export default router;
