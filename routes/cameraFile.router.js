import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import userCameraMiddleware from '../middleware/userCameraMiddleware.js';
import { asyncHandler } from '../middleware/errorHandlerMiddleware.js';
// import createFileController from '../controllers/file.controller.js';

export default (cameraFileController) => {
  const router = express.Router({ mergeParams: true });

  router.use(authMiddleware);
  router.use(userCameraMiddleware);

  router.get('/', asyncHandler(cameraFileController.getAll));
  router.get('/:fileId', asyncHandler(cameraFileController.getOne));

  router.post('/', asyncHandler(cameraFileController.createOne));

  router.delete('/:fileId', asyncHandler(cameraFileController.deleteOne));

  return router;
};
