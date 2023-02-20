import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import cameraMiddleware from '../middleware/cameraMiddleware.js';
import { asyncHandler } from '../middleware/errorHandlerMiddleware.js';
import fileController from '../controllers/file.controller.js';

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
