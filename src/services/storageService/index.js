import DiskStorage from './disk.storage.js';
import GridfsStorage from './gridfs.storage.js';

const storageTypeMap = {
  disk: DiskStorage,
  gridfs: GridfsStorage,
};

export default (container) => {
  const config = container.config;
  const storage = new storageTypeMap[config.storageType](container);
  return storage;
};
