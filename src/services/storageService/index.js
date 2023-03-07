import DiskStorage from './disk.storage.js';
import GridfsStorage from './gridfs.storage.js';

const storageTypeMap = {
  disk: DiskStorage,
  gridfs: GridfsStorage,
};

export default async (storageType) => {
  const storage = new storageTypeMap[storageType]();
  await storage.start();
  return storage;
};
