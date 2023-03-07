import express from 'express';
// import _ from 'lodash';
import { asyncHandler } from '../middlewares/errorHandler.middleware.js';
// import fileService from '../services/file.service.js';
import imageService from '../services/image.service.js';
import * as consts from '../utils/constants.js';
import storage from '../storage/index.js';
import { createFullPath } from '../storage/disk.storage.js';

const router = express.Router({ mergeParams: true });

//
// gridfs
//

// photo from gridfs

router.get(
  /g+\/u_[a-z0-9]+\/c_[a-z0-9]+\/.*\.jpg/,
  asyncHandler(async (req, res, next) => {
    req.reqLogger(`gridfs.storage.router.get jpg ${req.url}`);

    const fileLink = req._parsedUrl.pathname;
    const stream = storage.openDownloadStreamByLink({
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
    const stream = storage.openDownloadStreamByLink({
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

// router.get(
//   '/:link',
//   asyncHandler(async (req, res) => {
//     req.reqLogger(`disk.storage.router.get`);
//     console.log('req.params.link', req.params.link);

//     const file = await fileService.getOneById({
//       link: req.params.link,
//       logger: req.reqLogger,
//     });

//     console.log('file', file);

//     // if (!file) {
//     //   res.sendStatus(404);
//     //   req.resLogger(req);
//     //   return;
//     // }
//   })
// );

export default router;
