import express from 'express';
import { asyncHandler } from '../utils/index.js';

export default (middlewares, dateInfoController) => {
  const router = express.Router({ mergeParams: true });

  const { authMiddleware, cameraMiddleware } = middlewares;

  router.use(authMiddleware);
  router.use(cameraMiddleware);

  // /api/cameras/:cameraId/dateInfo/

  router.get('/', asyncHandler(dateInfoController.getMany.bind(dateInfoController)));

  router.get('/:date', asyncHandler(dateInfoController.getOne.bind(dateInfoController)));

  return router;
};
