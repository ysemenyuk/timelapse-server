import express from 'express';
import { asyncHandler } from '../utils/utils.js';

export default (container) => {
  const router = express.Router({ mergeParams: true });

  const authMiddleware = container.authMiddleware;
  const cameraMiddleware = container.cameraMiddleware;
  const taskValidator = container.taskValidator;
  const taskController = container.taskController;

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
