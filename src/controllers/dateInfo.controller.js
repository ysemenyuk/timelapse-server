import { dateInfoService } from '../services/index.js';

const getAll = async (req, res) => {
  req.reqLogger('dateInfo.controller getAll');

  const datesInfo = await dateInfoService.getAll({
    userId: req.userId,
    cameraId: req.params.cameraId,
    logger: req.reqLogger,
  });

  res.status(200).send(datesInfo);
  req.resLogger(req);
};

const getOne = async (req, res) => {
  req.reqLogger(`dateInfo.controller getOne`);

  const dateInfo = await dateInfoService.getOne({
    name: req.params.date,
    userId: req.userId,
    cameraId: req.params.cameraId,
    logger: req.reqLogger,
  });

  // console.log('dateInfo', dateInfo);

  res.status(200).send(dateInfo);
  req.resLogger(req);
};

export default {
  getAll,
  getOne,
};
