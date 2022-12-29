import express from 'express';
import { asyncHandler } from '../middleware/errorHandlerMiddleware.js';
import cameraFileService from '../services/cameraFile.service.js';
import imageService from '../services/image.service.js';
import storageService from '../services/storage.service.js';
import * as consts from '../utils/constants.js';

const router = express.Router();

// /files

router.get(
  '/:fileId',
  asyncHandler(async (req, res) => {
    req.logger(`storage.router.get /files/${req.params.fileId}`);

    const file = await cameraFileService.getOneById({
      fileId: req.params.fileId,
      logger: req.logger,
    });

    if (!file) {
      res.sendStatus(404);
      req.logResp(req);
      return;
    }

    const stream = storageService.openDownloadStream({
      filePath: file.pathOnDisk,
      fileName: file.nameOnDisk,
      logger: req.logger,
    });

    const isThumbnail = req.query && req.query.size && req.query.size === 'thumbnail';

    if (isThumbnail) {
      stream.pipe(imageService.resize(consts.THUMBNAIL_SIZE)).pipe(res);
    } else {
      stream.pipe(res);
    }

    stream.on('error', () => {
      // console.log('stream.on error', e);
      res.sendStatus(500);
      req.logResp(req);
    });

    stream.on('end', () => {
      // console.log('stream.on end');
      req.logResp(req);
    });
  })
);

export default router;
