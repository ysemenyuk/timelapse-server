import express from 'express';
import { asyncHandler } from '../utils/utils.js';

export default (container) => {
  const router = express.Router({ mergeParams: true });

  const authMiddleware = container.authMiddleware;
  const cameraMiddleware = container.cameraMiddleware;
  const dateInfoController = container.dateInfoController;

  router.use(authMiddleware);
  router.use(cameraMiddleware);

  // /api/cameras/:cameraId/dateInfo/

  router.get('/', asyncHandler(dateInfoController.getAll.bind(dateInfoController)));
  router.get('/:date', asyncHandler(dateInfoController.getOne.bind(dateInfoController)));

  return router;
};
