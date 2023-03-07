import express from 'express';
import { dateInfoController } from '../controllers/index.js';
import { authMiddleware, cameraMiddleware } from '../middlewares/index.js';
import { asyncHandler } from '../utils/utils.js';

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);
router.use(cameraMiddleware);

// /api/cameras/:cameraId/dateInfo/

router.get('/', asyncHandler(dateInfoController.getAll));
router.get('/:date', asyncHandler(dateInfoController.getOne));

export default router;
