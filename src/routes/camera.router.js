import express from 'express';
import { asyncHandler } from '../utils/utils.js';

export default (container) => {
  const router = express.Router({ mergeParams: true });

  const authMiddleware = container.authMiddleware;
  const cameraMiddleware = container.cameraMiddleware;
  const cameraValidator = container.cameraValidator;
  const cameraController = container.cameraController;

  router.use(authMiddleware);

  // /api/cameras

  router.get(
    '/',
    asyncHandler(cameraController.getAll.bind(cameraController)) //
  );

  router.get(
    '/:cameraId',
    cameraMiddleware,
    asyncHandler(cameraController.getOne.bind(cameraController)) //
  );

  router.post(
    '/',
    cameraValidator.validateCamera,
    asyncHandler(cameraController.createOne.bind(cameraController)) //
  );

  router.put(
    '/:cameraId',
    cameraMiddleware,
    cameraValidator.validateCamera,
    asyncHandler(cameraController.updateOne.bind(cameraController)) //
  );

  router.delete(
    '/:cameraId',
    cameraMiddleware,
    asyncHandler(cameraController.deleteOne.bind(cameraController)) //
  );

  router.get(
    '/:cameraId/stats',
    cameraMiddleware,
    asyncHandler(cameraController.getCameraStats.bind(cameraController)) //
  );

  return router;
};
