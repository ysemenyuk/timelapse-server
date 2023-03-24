import express from 'express';
import { asyncHandler } from '../utils/index.js';

export default (middlewares, storageController) => {
  const router = express.Router({ mergeParams: true });

  // photo

  router.get(
    /g+\/u_[a-z0-9]+\/c_[a-z0-9]+\/.*\.jpg/,
    asyncHandler(storageController.getPhotoByStream.bind(storageController))
  );

  // video

  router.get(
    /g+\/u_[a-z0-9]+\/c_[a-z0-9]+\/.*\.mp4/,
    asyncHandler(storageController.getVideoByStream.bind(storageController))
  );

  // photo from disk

  router.get(
    /u_[a-z0-9]+\/c_[a-z0-9]+\/.*\.jpg/,
    asyncHandler(storageController.getPhotoFromDisk.bind(storageController))
  );

  // video from disk

  router.get(
    /u_[a-z0-9]+\/c_[a-z0-9]+\/.*\.mp4/,
    asyncHandler(storageController.getVideoFromDisk.bind(storageController))
  );

  return router;
};
