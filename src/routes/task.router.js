import express from 'express';
import { asyncHandler } from '../utils/index.js';

export default (middlewares, taskController, taskValidator) => {
  const router = express.Router({ mergeParams: true });

  const { authMiddleware, cameraMiddleware } = middlewares;

  router.use(authMiddleware);
  router.use(cameraMiddleware);

  // /api/cameras/:cameraId/tasks

  router.get('/', asyncHandler(taskController.getAll.bind(taskController)));
  router.get('/:taskId', asyncHandler(taskController.getOne.bind(taskController)));

  router.post('/', taskValidator.validateTask, asyncHandler(taskController.createOne.bind(taskController)));

  router.put('/:taskId', taskValidator.validateTask, asyncHandler(taskController.updateOne.bind(taskController)));

  router.delete('/:taskId', asyncHandler(taskController.deleteOne.bind(taskController)));

  return router;
};
