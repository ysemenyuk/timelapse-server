import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import userCameraMiddleware from '../middleware/userCameraMiddleware.js';
import { asyncHandler } from '../middleware/errorHandlerMiddleware.js';

export default (cameraTaskController) => {
  const router = express.Router({ mergeParams: true });

  router.use(authMiddleware);
  router.use(userCameraMiddleware);

  router.get('/:taskId', asyncHandler(cameraTaskController.getOne));
  router.get('/', asyncHandler(cameraTaskController.getAll));

  router.post('/screenshot', asyncHandler(cameraTaskController.createScreenshot));
  router.post('/', asyncHandler(cameraTaskController.createOne));

  router.put('/:taskId/screenshotsByTime', asyncHandler(cameraTaskController.createScreenshotsByTime));
  router.put('/:taskId', asyncHandler(cameraTaskController.updateOne));

  router.delete('/:taskId', asyncHandler(cameraTaskController.deleteOne));

  return router;
};
