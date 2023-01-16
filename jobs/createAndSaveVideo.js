import fileService from '../services/file.service.js';
// import cameraService from '../services/camera.service.js';
import { makeVideoName, makeVideoNameOnDisk } from '../utils/index.js';
import { fileType, type } from '../utils/constants.js';
import storageService from '../services/storage.service.js';

const createAndSaveVideo = async ({ logger, userId, cameraId, taskId, create, videoSettings }) => {
  // const camera = await cameraService.getOneById({ cameraId });
  // const { videosFolder } = camera;

  const date = new Date();
  const videoName = videoSettings.fileName || makeVideoName(date);

  //
  const videoDir = storageService.createVideosDirPath(userId, cameraId);
  const videoNameOnDisk = makeVideoNameOnDisk(date);
  const videoPathOnDisk = [...videoDir, videoNameOnDisk];
  const videoPath = [...videoDir, 'timelapse.mp4'];
  await storageService.copyFile({ logger, sourceFilePath: videoPath, destinationFilePath: videoPathOnDisk });
  //

  // const stat = await storageService.fileStat({ logger, filePath: videoPathOnDisk });

  const video = await fileService.createFile({
    logger,
    date,
    user: userId,
    camera: cameraId,
    task: taskId,
    name: videoName,
    type: type.VIDEO,
    fileType: fileType.VIDEO_MP4,
    createType: create,
    data: undefined,
    metaData: {
      startDate: videoSettings.startDate,
      endDate: videoSettings.endDate,
      fps: videoSettings.fps,
      duration: videoSettings.duration,
      poster: null, // photo id
    },
  });

  return video;
};

export default createAndSaveVideo;
