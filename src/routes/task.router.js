import express from 'express';
// import authMiddleware from '../middleware/authMiddleware.js';
// import cameraMiddleware from '../middleware/cameraMiddleware.js';
// import taskController from '../controllers/task.controller.js';
// import taskValidator from '../validators/task.validator.yup.js';
import { asyncHandler } from '../utils/utils.js';

export default ({ taskController }, { authMiddleware, cameraMiddleware }, { taskValidator }) => {
  const router = express.Router({ mergeParams: true });

  router.use(authMiddleware);
  router.use(cameraMiddleware);

  // /api/cameras/:cameraId/tasks

  router.get('/', asyncHandler(taskController.getAll));
  router.get('/:taskId', asyncHandler(taskController.getOne));

  router.post('/', taskValidator, asyncHandler(taskController.createOne));

  router.put('/:taskId', taskValidator, asyncHandler(taskController.updateOne));

  router.delete('/:taskId', asyncHandler(taskController.deleteOne));

  return router;
};
