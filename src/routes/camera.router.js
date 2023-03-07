import express from 'express';
// import authMiddleware from '../middleware/authMiddleware.js';
// import cameraMiddleware from '../middleware/cameraMiddleware.js';
// import cameraValidator from '../validators/camera.validator.yup.js';
// import cameraController from '../controllers/camera.controller.js';
import { asyncHandler } from '../utils/utils.js';

export default (controllers, middlewares, validators) => {
  const router = express.Router({ mergeParams: true });

  const { authMiddleware, cameraMiddleware } = middlewares;
  const { cameraValidator } = validators;
  const { cameraController } = controllers;

  router.use(authMiddleware);

  // /api/cameras

  router.get('/', asyncHandler(cameraController.getAll));
  router.get('/:cameraId', cameraMiddleware, asyncHandler(cameraController.getOne));
  router.get('/:cameraId/stats', cameraMiddleware, asyncHandler(cameraController.getCameraStats));

  router.post('/', cameraValidator.validateCamera, asyncHandler(cameraController.createOne));

  router.put('/:cameraId', cameraMiddleware, cameraValidator.validateCamera, asyncHandler(cameraController.updateOne));

  router.delete('/:cameraId', cameraMiddleware, asyncHandler(cameraController.deleteOne));

  return router;
};
