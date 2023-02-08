import express from 'express';
import _ from 'lodash';
import { asyncHandler } from '../middleware/errorHandlerMiddleware.js';
// import fileService from '../services/file.service.js';
import imageService from '../services/image.service.js';
import * as consts from '../utils/constants.js';
import diskStorage from '../storage/disk.storage.js';
import storageService from '../storage/index.js';

const router = express.Router({ mergeParams: true });

//
// gridfs
//

// photo from gridfs

router.get(
  /g+\/u_[a-z0-9]+\/c_[a-z0-9]+\/.*\.jpg/,
  asyncHandler(async (req, res, next) => {
    req.logger(`gridfs.storage.router.get jpg ${req.url}`);

    const filePath = _.trimStart(req._parsedUrl.pathname, '/g/');
    const stream = storageService.openDownloadStream({
      logger: req.logger,
      filePath,
    });

    const isThumbnail = req.query && req.query.size && req.query.size === 'thumbnail';

    if (isThumbnail) {
      stream.pipe(imageService.resize(consts.THUMBNAIL_SIZE)).pipe(res);
    } else {
      stream.pipe(res);
    }

    stream.on('error', (err) => {
      next(err);
      req.logResp(req);
    });

    stream.on('end', () => {
      req.logResp(req);
    });
  })
);

// video from gridfs

router.get(
  /u_[a-z0-9]+\/c_[a-z0-9]+\/.*\.mp4/,
  asyncHandler(async (req, res, next) => {
    req.logger(`gridfs.storage.router.get mp4 ${req.url}`);

    const filePath = req._parsedUrl.pathname;
    const stream = storageService.openDownloadStream({
      logger: req.logger,
      filePath,
    });

    stream.pipe(res);

    stream.on('error', (err) => {
      next(err);
      req.logResp(req);
    });

    stream.on('end', () => {
      req.logResp(req);
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
    req.logger(`disk.storage.router.get jpg ${req.url}`);
    // console.log(1111, req._parsedUrl);

    const filePath = req._parsedUrl.pathname;
    const fileFullPath = diskStorage.createFullPath(filePath);

    const isThumbnail = req.query && req.query.size && req.query.size === 'thumbnail';

    if (isThumbnail) {
      res.set('Content-Type', 'image/jpg');
      const buffer = await imageService.resizeToBuffer(fileFullPath, consts.THUMBNAIL_SIZE);
      res.send(buffer);
      req.logResp(req);
      return;
    }

    res.sendFile(fileFullPath);
    req.logResp(req);
  })
);

// video from disk

router.get(
  /u_[a-z0-9]+\/c_[a-z0-9]+\/.*\.mp4/,
  asyncHandler(async (req, res) => {
    req.logger(`disk.storage.router.get mp4 ${req.url}`);
    // console.log(222, req._parsedUrl);

    const filePath = req._parsedUrl.pathname;
    const fileFullPath = diskStorage.createFullPath(filePath);

    res.sendFile(fileFullPath);
    req.logResp(req);
  })
);

// by fileId

// router.get(
//   '/:fileId',
//   asyncHandler(async (req, res) => {
//     req.logger(`disk.storage.router.get :id ${req.params.fileId}`);
//     // console.log(333, req._parsedUrl);

//     const file = await fileService.getOneById({
//       itemId: req.params.fileId,
//       logger: req.logger,
//     });

//     if (!file) {
//       res.sendStatus(404);
//       req.logResp(req);
//       return;
//     }
//   })
// );

export default router;
