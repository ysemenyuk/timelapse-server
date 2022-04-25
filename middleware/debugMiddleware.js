import { v4 as uuidv4 } from 'uuid';
import debug from 'debug';

const logger = debug('request');

export default (req, res, next) => {
  const requestId = uuidv4();

  req.requestId = requestId;
  req.logger = logger.extend(requestId);

  req.logResp = (req) => req.logger(`RES: ${req.method} -${req.originalUrl} -${res.statusCode}`);

  req.logger(`REQ: ${req.method}-${req.originalUrl}`);

  next();
};
