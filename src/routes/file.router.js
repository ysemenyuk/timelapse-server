import express from 'express';
import { asyncHandler } from '../utils/utils.js';

export default (container) => {
  const router = express.Router({ mergeParams: true });

  const authMiddleware = container.authMiddleware;
  const cameraMiddleware = container.cameraMiddleware;
  const fileController = container.fileController;

  router.use(authMiddleware);
  router.use(cameraMiddleware);

  // /api/cameras/:cameraId/files

  router.get('/', asyncHandler(fileController.getAll.bind(fileController)));
  router.get('/:fileId', asyncHandler(fileController.getOne.bind(fileController)));
  router.put('/:fileId', asyncHandler(fileController.updateOne.bind(fileController)));
  router.delete('/:fileId', asyncHandler(fileController.deleteOne.bind(fileController)));

  router.post('/upload', asyncHandler(fileController.upload.bind(fileController)));
  router.get('/download', asyncHandler(fileController.download.bind(fileController)));

  router.get('/count', asyncHandler(fileController.getCount.bind(fileController)));
  router.get('/countsByDates', asyncHandler(fileController.getCountsByDates.bind(fileController)));

  return router;
};
