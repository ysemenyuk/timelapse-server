import express from 'express';
import { asyncHandler } from '../middleware/errorHandlerMiddleware.js';
import fileService from '../services/file.service.js';
import imageService from '../services/image.service.js';
import * as consts from '../utils/constants.js';
import util from 'util';
import { exec } from 'child_process';
import { createFilePath, createPosterFilePath } from '../storage/utils.js';
import diskStorage from '../storage/disk.storage.js';

const router = express.Router();
const execp = util.promisify(exec);

// /files

router.get(
  '/:fileId/poster',
  asyncHandler(async (req, res) => {
    req.logger(`storage.router.get /files/${req.params.fileId}/poster`);

    const file = await fileService.getOneById({
      itemId: req.params.fileId,
      logger: req.logger,
    });

    if (!file || file.type != 'video') {
      res.sendStatus(404);
      req.logResp(req);
      return;
    }

    const videoFilePath = createFilePath({ logger: req.logger, file });
    const posterFilePath = createPosterFilePath({ logger: req.logger, file });

    const videoFileFullPath = diskStorage.createFullPath(videoFilePath);
    const posterFileFullPath = diskStorage.createFullPath(posterFilePath);

    if (!diskStorage.isFileExist({ logger: req.logger, filePath: posterFilePath })) {
      await execp(`ffmpeg -y -i ${videoFileFullPath} -ss 00:00:1 -frames:v 1 ${posterFileFullPath}`);
    }

    res.sendFile(posterFileFullPath);
    req.logResp(req);
  })
);

//

router.get(
  '/:fileId',
  asyncHandler(async (req, res) => {
    req.logger(`storage.router.get /files/${req.params.fileId}`);

    const file = await fileService.getOneById({
      itemId: req.params.fileId,
      logger: req.logger,
    });

    if (!file) {
      res.sendStatus(404);
      req.logResp(req);
      return;
    }

    const filePath = createFilePath({ logger: req.logger, file });
    const fileFullPath = diskStorage.createFullPath(filePath);

    const isThumbnail = req.query && req.query.size && req.query.size === 'thumbnail';

    if (isThumbnail) {
      res.set('Content-Type', 'image/jpg');
      const buffer = await imageService.resizeImage(fileFullPath, consts.THUMBNAIL_SIZE);
      res.send(buffer);
      req.logResp(req);
      return;
    }

    res.sendFile(fileFullPath);
    req.logResp(req);
    return;

    //   const stream = diskStorage.openDownloadStream({
    //     filePath,
    //     logger: req.logger,
    //   });

    //   if (isThumbnail) {
    //     stream.pipe(imageService.resize(consts.THUMBNAIL_SIZE)).pipe(res);
    //   } else {
    //     stream.pipe(res);
    //   }

    //   stream.on('error', () => {
    //     // console.log('stream.on error', e);
    //     res.sendStatus(500);
    //     req.logResp(req);
    //   });

    //   stream.on('end', () => {
    //     // console.log('stream.on end');
    //     req.logResp(req);
    //   });
  })
);

export default router;
