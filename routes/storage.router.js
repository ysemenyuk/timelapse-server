import express from 'express';
import { asyncHandler } from '../middleware/errorHandlerMiddleware.js';
import fileService from '../services/file.service.js';
import imageService from '../services/image.service.js';
import storageService from '../services/storage.service.js';
import * as consts from '../utils/constants.js';
import fs from 'fs';
import path from 'path';
import util from 'util';
import { exec } from 'child_process';

const pathToStorage = process.env.PATH_TO_STORAGE;

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

    const video = path.join(pathToStorage, ...file.pathOnDisk);
    // const tmpDir = await mkdtemp(path.join(pathToStorage, 'tmp-'));
    const tmpDir = path.join(pathToStorage, 'tmp');
    const poster = path.join(tmpDir, `${file._id}.jpg`);

    if (!fs.existsSync(poster)) {
      await execp(`ffmpeg -y -i ${video} -ss 00:00:1 -frames:v 1 ${poster}`);
    }

    res.sendFile(poster);
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

    if (file.type === 'video') {
      const fullPath = storageService.creteFullPath(file.pathOnDisk);

      res.sendFile(fullPath);
      req.logResp(req);
      return;
    }

    const stream = storageService.openDownloadStream({
      filePath: file.pathOnDisk,
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
