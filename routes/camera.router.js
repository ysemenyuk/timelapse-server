import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import cameraValidator from '../validators/camera.validators.ajv.js';
import { asyncHandler } from '../middleware/errorHandlerMiddleware.js';

export default (cameraController) => {
  const router = express.Router({ mergeParams: true });

  router.use(authMiddleware);

  router.get('/', asyncHandler(cameraController.getAll));
  router.get('/:cameraId', asyncHandler(cameraController.getOne));

  router.post('/', cameraValidator.createOne, asyncHandler(cameraController.createOne));

  router.put('/:cameraId', cameraValidator.updateOne, asyncHandler(cameraController.updateOne));

  router.delete('/:cameraId', asyncHandler(cameraController.deleteOne));

  return router;
};
