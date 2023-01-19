import express from 'express';
import { asyncHandler } from '../middleware/errorHandlerMiddleware.js';
import fileService from '../services/file.service.js';
import imageService from '../services/image.service.js';
import * as consts from '../utils/constants.js';
import diskStorage from '../storage/disk.storage.js';

const router = express.Router({ mergeParams: true });

// /files

router.get(
  /u_[a-z0-9]+\/c_[a-z0-9]+\/.*\.jpg/,
  asyncHandler(async (req, res, next) => {
    req.logger(`disk.storage.router.get jpg ${req.url}`);
    // console.log(1111, req._parsedUrl);

    const isThumbnail = req.query && req.query.size && req.query.size === 'thumbnail';
    const filePath = req._parsedUrl.pathname;

    // stream

    const stream = diskStorage.openDownloadStream({
      logger: req.logger,
      filePath,
    });

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

    // sendFile

    // const fileFullPath = diskStorage.createFullPath(filePath);

    // if (isThumbnail) {
    //   res.set('Content-Type', 'image/jpg');
    //   const buffer = await imageService.resizeToBuffer(fileFullPath, consts.THUMBNAIL_SIZE);
    //   res.send(buffer);
    //   req.logResp(req);
    //   return;
    // }

    // res.sendFile(fileFullPath);
    // req.logResp(req);
  })
);

//

router.get(
  /u_[a-z0-9]+\/c_[a-z0-9]+\/.*\.mp4/,
  asyncHandler(async (req, res) => {
    req.logger(`disk.storage.router.get mp4 ${req.url}`);
    // console.log(222, req._parsedUrl);

    const fileFullPath = diskStorage.createFullPath(req._parsedUrl.pathname);

    res.sendFile(fileFullPath);
    req.logResp(req);
  })
);

//

router.get(
  '/:fileId',
  asyncHandler(async (req, res) => {
    req.logger(`disk.storage.router.get :id ${req.params.fileId}`);
    // console.log(333, req._parsedUrl);

    const file = await fileService.getOneById({
      itemId: req.params.fileId,
      logger: req.logger,
    });

    if (!file) {
      res.sendStatus(404);
      req.logResp(req);
      return;
    }

    const filePath = diskStorage.createFilePath({ logger: req.logger, file });
    const fileFullPath = diskStorage.createFullPath(filePath);

    const isImage = file.fileType && file.fileType.includes('image');
    const isThumbnail = req.query && req.query.size && req.query.size === 'thumbnail';

    if (isImage && isThumbnail) {
      res.set('Content-Type', 'image/jpg');
      const buffer = await imageService.resizeToBuffer(fileFullPath, consts.THUMBNAIL_SIZE);
      res.send(buffer);
      req.logResp(req);
      return;
    }

    res.sendFile(fileFullPath);
    req.logResp(req);
    return;
  })
);

export default router;
