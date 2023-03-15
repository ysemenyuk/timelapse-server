import debug from 'debug';

export default class LoggerService {
  constructor() {
    this.logger = debug;
  }

  create(name) {
    return this.logger(name);
  }

  extend(logger, name) {
    return logger.extend(name);
  }
}
