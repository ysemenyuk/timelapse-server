import { v4 as uuidv4 } from 'uuid';

export default (loggerService) => (req, res, next) => {
  const requestId = uuidv4();

  req.requestId = requestId;
  req.reqLogger = loggerService.createLogger(`requestId:${requestId}`);

  req.resLogger = (req) => req.reqLogger(`RES: ${req.method} -${req.originalUrl} -${res.statusCode}`);

  req.reqLogger(`REQ: ${req.method} -${req.originalUrl}`);

  next();
};
