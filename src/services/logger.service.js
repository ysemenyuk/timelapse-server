import debug from 'debug';

export default class LoggerService {
  create(name) {
    return debug(name);
  }

  extend(logger, name) {
    return logger.extend(name);
  }
}
