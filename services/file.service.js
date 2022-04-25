import * as fsp from 'fs/promises';
import path from 'path';
import __dirname from '../dirname.js';

const pathToFiles = path.join(__dirname, 'files');

const makeDir = (pathToDir) => {
  console.log('makeDir pathToDir - ', pathToDir);
  const fullPath = path.join(pathToFiles, pathToDir);
  return fsp
    .mkdir(fullPath)
    .catch((e) => console.log(`catch makeDir pathToDir error: ${e.message}`));
};

const writeFile = (pathToFile, data = '') => {
  console.log('writeFile pathToFile - ', pathToFile);
  const fullPath = path.join(pathToFiles, pathToFile);
  return fsp
    .writeFile(fullPath, data)
    .catch((e) => console.log(`catch writeFile pathToFile error: ${e.message}`));
};

const readFile = (pathToFile) => {
  console.log('readFile pathToFile - ', pathToFile);
  const fullPath = path.join(pathToFiles, pathToFile);
  return fsp
    .readFile(fullPath)
    .catch((e) => console.log(`catch readFile pathToFile error: ${e.message}`));
};

const removeDir = (pathToDir) => {
  console.log('removeDir pathToDir - ', pathToDir);
  const fullPath = path.join(pathToFiles, pathToDir);
  return fsp
    .rmdir(fullPath, { recursive: true })
    .catch((e) => console.log(`catch removeDir error: ${e.message}`));
};

const removeFile = (pathToFile) => {
  console.log('removeFile pathToFile - ', pathToFile);
  const fullPath = path.join(pathToFiles, pathToFile);
  return fsp.unlink(fullPath).catch((e) => console.log(`catch removeFile error: ${e.message}`));
};

export default { makeDir, writeFile, readFile, removeDir, removeFile };
