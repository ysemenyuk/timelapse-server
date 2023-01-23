import dateInfoService from '../services/dateInfo.service.js';

const getAll = async (req, res) => {
  req.logger('dateInfo.controller getAll');

  const datesInfo = await dateInfoService.getAll({
    userId: req.userId,
    cameraId: req.params.cameraId,
    logger: req.logger,
  });

  res.status(200).send(datesInfo);
  req.logResp(req);
};

const getOne = async (req, res) => {
  req.logger(`dateInfo.controller getOne`);

  const dateInfo = await dateInfoService.getOne({
    name: req.params.date,
    userId: req.userId,
    cameraId: req.params.cameraId,
    logger: req.logger,
  });

  // console.log('dateInfo', dateInfo);

  res.status(200).send(dateInfo);
  req.logResp(req);
};

export default {
  getAll,
  getOne,
};
