import DiskStorage from './disk.storage.js';
import GridfsStorage from './gridfs.storage.js';

const storageTypeMap = {
  disk: DiskStorage,
  gridfs: GridfsStorage,
};

export default async (config) => {
  const storage = new storageTypeMap[config.storageType]();
  await storage.init();
  return storage;
};
