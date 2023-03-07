import express from 'express';
// import dateInfoController from '../controllers/dateInfo.controller.js';
// import authMiddleware from '../middleware/authMiddleware.js';
// import cameraMiddleware from '../middleware/cameraMiddleware.js';
import { asyncHandler } from '../utils/utils.js';

export default ({ dateInfoController }, { authMiddleware, cameraMiddleware }) => {
  const router = express.Router({ mergeParams: true });

  router.use(authMiddleware);
  router.use(cameraMiddleware);

  // /api/cameras/:cameraId/dateInfo/

  router.get('/', asyncHandler(dateInfoController.getAll));
  router.get('/:date', asyncHandler(dateInfoController.getOne));

  return router;
};
