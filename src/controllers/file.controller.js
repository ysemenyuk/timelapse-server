export default class FileController {
  constructor(fileService) {
    this.fileService = fileService;
  }

  // get

  async getAll(req, res) {
    req.reqLogger(`fileController.getAll`);

    const files = await this.fileService.getMany({
      logger: req.reqLogger,
      cameraId: req.cameraId,
      query: req.query,
    });

    res.status(200).send(files);
    req.resLogger(req);
  }

  async getCount(req, res) {
    req.reqLogger(`fileController.getCount`);

    console.log(1111111);

    const count = await this.fileService.getCount({
      logger: req.reqLogger,
      cameraId: req.cameraId,
      query: req.query,
    });

    res.status(200).send(count);
    req.resLogger(req);
  }

  async getCountsByDates(req, res) {
    req.reqLogger(`fileController.getCountsByDates`);

    console.log(2222222);

    const counts = await this.fileService.getCountsByDates({
      logger: req.reqLogger,
      cameraId: req.cameraId,
      query: req.query,
    });

    res.status(200).send(counts);
    req.resLogger(req);
  }

  async getOne(req, res) {
    req.reqLogger(`fileController.getOne`);

    const file = await this.fileService.getOneById({
      fileId: req.params.fileId,
      logger: req.reqLogger,
    });

    res.status(200).send(file);
    req.resLogger(req);
  }

  //

  async upload(req, res) {
    req.reqLogger('fileController.upload');

    res.status(201).send('upload');
    req.resLogger(req);
  }

  async download(req, res) {
    req.reqLogger('fileController.download');

    res.status(201).send('download');
    req.resLogger(req);
  }

  //

  async updateOne(req, res) {
    req.reqLogger('fileController.updateOne');

    // TODO: check req.body take fields by schema!
    const payload = req.body;

    const file = await this.fileService.updateOneById({
      logger: req.reqLogger,
      fileId: req.params.fileId,
      payload,
    });

    res.status(201).send(file);
    req.resLogger(req);
  }

  //

  async deleteOne(req, res) {
    req.reqLogger(`fileController.deleteOne`);

    const deleted = await this.fileService.deleteOneById({
      itemId: req.params.fileId,
      logger: req.reqLogger,
    });

    res.status(204).send(deleted);
    req.resLogger(req);
  }
}
