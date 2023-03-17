import { imageSize } from '../utils/constants.js';

export default class StorageController {
  constructor(storageService, imageService) {
    this.storageService = storageService;
    this.imageService = imageService;
  }

  //

  async getPhotoByStream(req, res, next) {
    // req.reqLogger('storageController getPhotoByStream');

    const fileLink = req._parsedUrl.pathname;
    const stream = this.storageService.openDownloadStreamByLink({
      // logger: req.reqLogger,
      fileLink,
    });

    const isThumbnail = req.query && req.query.size && req.query.size === 'thumbnail';

    if (isThumbnail) {
      stream.pipe(this.imageService.resize(imageSize.THUMBNAIL)).pipe(res);
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
  }

  async getVideoByStream(req, res, next) {
    // req.reqLogger(`storageController getVideoByStream`);

    const fileLink = req._parsedUrl.pathname;
    const stream = this.storageService.openDownloadStreamByLink({
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
  }
}
