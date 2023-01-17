// create dir

const createDir = async ({ logger, dirPath }) => {
  logger && logger(`cloud.storage.createDir dirPath: ${dirPath}`);
};

// remove dir

const removeDir = async ({ logger, dirPath }) => {
  logger && logger(`cloud.storage.removeDir dirPath: ${dirPath}`);
};

// save file

const saveFile = async ({ logger, filePath, data }) => {
  logger && logger(`cloud.storage.saveFile filePath: ${filePath}`);
  console.log('data', data);
};

// remove file

const removeFile = async ({ logger, filePath }) => {
  logger && logger(`cloud.storage.removeFile filePath: ${filePath}`);
};

// streams

const openUploadStream = ({ logger, filePath }) => {
  logger && logger(`cloud.storage.openUploadStream filePath: ${filePath}`);
};

const openDownloadStream = ({ logger, filePath }) => {
  logger && logger(`cloud.storage.openDownloadStream filePath: ${filePath}`);
};

//

const fileStat = async ({ logger, filePath }) => {
  logger && logger(`cloud.storage.fileStat filePath: ${filePath}`);
};

const isDirExist = ({ logger, dirPath }) => {
  logger && logger(`cloud.storage.isDirExist dirPath: ${dirPath}`);
};

const isFileExist = ({ logger, filePath }) => {
  logger && logger(`cloud.storage.isFileExist filePath: ${filePath}`);
};

export default {
  createDir,
  removeDir,
  saveFile,
  removeFile,
  openUploadStream,
  openDownloadStream,
  fileStat,
  isDirExist,
  isFileExist,
};
