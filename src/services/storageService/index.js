import DiskStorage from './disk.storage.js';
import GridfsStorage from './gridfs.storage.js';

const storageTypeMap = {
  disk: DiskStorage,
  gridfs: GridfsStorage,
};

export default (storageType) => storageTypeMap[storageType];
