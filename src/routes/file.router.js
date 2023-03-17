import express from 'express';
import { asyncHandler } from '../utils/index.js';

export default (middlewares, fileController) => {
  const router = express.Router({ mergeParams: true });

  const { authMiddleware, cameraMiddleware } = middlewares;

  router.use(authMiddleware);
  router.use(cameraMiddleware);

  // /api/cameras/:cameraId/files

  router.get('/', asyncHandler(fileController.getAll.bind(fileController)));

  router.post('/upload', asyncHandler(fileController.upload.bind(fileController)));
  router.get('/download', asyncHandler(fileController.download.bind(fileController)));

  router.get('/count', asyncHandler(fileController.getCount.bind(fileController)));
  router.get('/countsByDates', asyncHandler(fileController.getCountsByDates.bind(fileController)));

  router.get('/:fileId', asyncHandler(fileController.getOne.bind(fileController)));
  router.put('/:fileId', asyncHandler(fileController.updateOne.bind(fileController)));
  router.delete('/:fileId', asyncHandler(fileController.deleteOne.bind(fileController)));

  return router;
};
