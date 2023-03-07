import express from 'express';
import { fileController } from '../controllers/index.js';
import { authMiddleware, cameraMiddleware } from '../middlewares/index.js';
import { asyncHandler } from '../utils/utils.js';

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);
router.use(cameraMiddleware);

// /api/cameras/:cameraId/files

router.get('/', asyncHandler(fileController.getAll));

router.get('/count', asyncHandler(fileController.getCount));
router.get('/countsByDates', asyncHandler(fileController.getCountsByDates));

router.get('/:fileId', asyncHandler(fileController.getOne));

router.post('/', asyncHandler(fileController.createOne));

router.put('/:fileId', asyncHandler(fileController.updateOne));

router.delete('/:fileId', asyncHandler(fileController.deleteOne));

export default router;
