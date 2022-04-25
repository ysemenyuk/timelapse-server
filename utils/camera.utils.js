import path from 'path';

// console.log('cameraPaths');

const getDirsNames = (camera) => {
  const cameraDir = camera._id.toString();
  console.log('getCameraNames cameraDir-', cameraDir);
  return {
    cameraDir,
    screenshotsDir: 'screenshots',
    imagesDir: 'images',
    videosDir: 'videos',
    logFile: 'log.txt',
  };
};

const getDirsPaths = (names) => {
  const { cameraDir, screenshotsDir, imagesDir, videosDir, logFile } = names;
  const pathToCameraDir = path.join(cameraDir);
  console.log('getCameraPaths pathToCameraDir -', pathToCameraDir);
  return {
    pathToCameraDir,
    pathToScreenshotsDir: path.join(pathToCameraDir, screenshotsDir),
    pathToImagesDir: path.join(pathToCameraDir, imagesDir),
    pathToVideosDir: path.join(pathToCameraDir, videosDir),
    pathToLogFile: path.join(pathToCameraDir, logFile),
  };
};

export { getDirsNames, getDirsPaths };
