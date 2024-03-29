export default class DateInfoController {
  constructor(dateInfoService) {
    this.dateInfoService = dateInfoService;
  }

  async getMany(req, res) {
    req.reqLogger('dateInfo.controller getMany');

    const datesInfo = await this.dateInfoService.getMany({
      userId: req.userId,
      cameraId: req.params.cameraId,
      logger: req.reqLogger,
    });

    res.status(200).send(datesInfo);
    req.resLogger(req);
  }

  async getOne(req, res) {
    req.reqLogger(`dateInfo.controller getOne`);

    const dateInfo = await this.dateInfoService.getOne({
      name: req.params.date,
      userId: req.userId,
      cameraId: req.params.cameraId,
      logger: req.reqLogger,
    });

    // console.log('dateInfo', dateInfo);

    res.status(200).send(dateInfo);
    req.resLogger(req);
  }
}
