import express from 'express';
// import authMiddleware from '../middleware/authMiddleware.js';
// import cameraMiddleware from '../middleware/cameraMiddleware.js';
// import cameraValidator from '../validators/camera.validator.yup.js';
// import cameraController from '../controllers/camera.controller.js';
import { asyncHandler } from '../utils/utils.js';

export default ({ cameraController }, { authMiddleware, cameraMiddleware }, { cameraValidator }) => {
  const router = express.Router({ mergeParams: true });

  router.use(authMiddleware);

  // /api/cameras

  router.get('/', asyncHandler(cameraController.getAll));
  router.get('/:cameraId', cameraMiddleware, asyncHandler(cameraController.getOne));
  router.get('/:cameraId/stats', cameraMiddleware, asyncHandler(cameraController.getCameraStats));

  router.post('/', cameraValidator, asyncHandler(cameraController.createOne));

  router.put('/:cameraId', cameraMiddleware, cameraValidator, asyncHandler(cameraController.updateOne));

  router.delete('/:cameraId', cameraMiddleware, asyncHandler(cameraController.deleteOne));

  return router;
};
