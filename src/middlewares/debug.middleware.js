import { v4 as uuidv4 } from 'uuid';
import debug from 'debug';

const logger = debug('request');

export default (req, res, next) => {
  const requestId = uuidv4();

  req.requestId = requestId;
  req.reqLogger = logger.extend(requestId);

  req.resLogger = (req) => req.reqLogger(`RES: ${req.method} -${req.originalUrl} -${res.statusCode}`);

  req.reqLogger(`REQ: ${req.method} -${req.originalUrl}`);

  next();
};
