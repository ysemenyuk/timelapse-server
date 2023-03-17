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

  //
  // disk
  //

  // file from disk

  //   router.get(
  //     /u_[a-z0-9]+\/c_[a-z0-9]+\/.*\.jpg/,
  //     asyncHandler(async (req, res) => {
  //       req.reqLogger(`disk.storage.router.get jpg ${req.url}`);
  //       // console.log(1111, req._parsedUrl.path);

  //       const filePath = req._parsedUrl.pathname;
  //       const fileFullPath = createFullPath(filePath);

  //       const isThumbnail = req.query && req.query.size && req.query.size === 'thumbnail';

  //       if (isThumbnail) {
  //         res.set('Content-Type', 'image/jpg');
  //         const buffer = await imageService.resizeToBuffer(fileFullPath, consts.THUMBNAIL_SIZE);
  //         res.send(buffer);
  //         req.resLogger(req);
  //         return;
  //       }

  //       res.sendFile(fileFullPath);
  //       req.resLogger(req);
  //     })
  //   );

  //   // video from disk

  //   router.get(
  //     /u_[a-z0-9]+\/c_[a-z0-9]+\/.*\.mp4/,
  //     asyncHandler(async (req, res) => {
  //       req.reqLogger(`disk.storage.router.get mp4 ${req.url}`);
  //       // console.log(222, req._parsedUrl.path);

  //       const filePath = req._parsedUrl.pathname;
  //       const fileFullPath = createFullPath(filePath);

  //       res.sendFile(fileFullPath);
  //       req.resLogger(req);
  //     })
  //   );

  return router;
};
