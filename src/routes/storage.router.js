import express from 'express';
import path from 'path';
import * as consts from '../utils/constants.js';
import { asyncHandler } from '../utils/utils.js';

export default (container) => {
  const router = express.Router({ mergeParams: true });

  const storageService = container.storageService;
  const imageService = container.imageService;

  const config = container.config;

  function createFullPath(filePath) {
    return path.join(config.pathToDiskSpace, filePath);
  }

  //
  // gridfs
  //

  // photo from gridfs

  router.get(
    /g+\/u_[a-z0-9]+\/c_[a-z0-9]+\/.*\.jpg/,
    asyncHandler(async (req, res, next) => {
      req.reqLogger(`gridfs.storage.router.get jpg ${req.url}`);

      const fileLink = req._parsedUrl.pathname;
      const stream = storageService.openDownloadStreamByLink({
        // logger: req.reqLogger,
        fileLink,
      });

      const isThumbnail = req.query && req.query.size && req.query.size === 'thumbnail';

      if (isThumbnail) {
        stream.pipe(imageService.resize(consts.THUMBNAIL_SIZE)).pipe(res);
      } else {
        stream.pipe(res);
      }

      stream.on('error', (err) => {
        next(err);
        req.resLogger(req);
      });

      stream.on('end', () => {
        req.resLogger(req);
      });
    })
  );

  // video from gridfs

  router.get(
    /g+\/u_[a-z0-9]+\/c_[a-z0-9]+\/.*\.mp4/,
    asyncHandler(async (req, res, next) => {
      req.reqLogger(`gridfs.storage.router.get mp4 ${req.url}`);

      const fileLink = req._parsedUrl.pathname;
      const stream = storageService.openDownloadStreamByLink({
        // logger: req.reqLogger,
        fileLink,
      });

      stream.pipe(res);

      stream.on('error', (err) => {
        next(err);
        req.resLogger(req);
      });

      stream.on('end', () => {
        req.resLogger(req);
      });
    })
  );

  //
  // disk
  //

  // file from disk

  router.get(
    /u_[a-z0-9]+\/c_[a-z0-9]+\/.*\.jpg/,
    asyncHandler(async (req, res) => {
      req.reqLogger(`disk.storage.router.get jpg ${req.url}`);
      // console.log(1111, req._parsedUrl.path);

      const filePath = req._parsedUrl.pathname;
      const fileFullPath = createFullPath(filePath);

      const isThumbnail = req.query && req.query.size && req.query.size === 'thumbnail';

      if (isThumbnail) {
        res.set('Content-Type', 'image/jpg');
        const buffer = await imageService.resizeToBuffer(fileFullPath, consts.THUMBNAIL_SIZE);
        res.send(buffer);
        req.resLogger(req);
        return;
      }

      res.sendFile(fileFullPath);
      req.resLogger(req);
    })
  );

  // video from disk

  router.get(
    /u_[a-z0-9]+\/c_[a-z0-9]+\/.*\.mp4/,
    asyncHandler(async (req, res) => {
      req.reqLogger(`disk.storage.router.get mp4 ${req.url}`);
      // console.log(222, req._parsedUrl.path);

      const filePath = req._parsedUrl.pathname;
      const fileFullPath = createFullPath(filePath);

      res.sendFile(fileFullPath);
      req.resLogger(req);
    })
  );

  return router;
};
