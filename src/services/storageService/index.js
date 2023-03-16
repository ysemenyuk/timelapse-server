import DiskStorage from './disk.storage.js';
import GridfsStorage from './gridfs.storage.js';

const storageTypeMap = {
  disk: DiskStorage,
  gridfs: GridfsStorage,
};

export default (loggerService, config) => {
  const storageService = new storageTypeMap[config.storageType](loggerService);
  return storageService;
};
