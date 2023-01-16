import fileService from '../services/file.service.js';
import cameraService from '../services/camera.service.js';
import { makeVideoName, makeVideoNameOnDisk } from '../utils/index.js';
import { fileType, type } from '../utils/constants.js';
import storageService from '../services/storage.service.js';

const createAndSaveVideo = async ({ logger, userId, cameraId, create, videoSettings }) => {
  const camera = await cameraService.getOneById({ cameraId });
  const { videosFolder } = camera;

  const date = new Date();
  const videoName = videoSettings.fileName || makeVideoName(date);
  const videoNameOnDisk = makeVideoNameOnDisk(date);
  const videoPathOnDisk = [...videosFolder.pathOnDisk, videoNameOnDisk];

  //
  const videoPath = [...videosFolder.pathOnDisk, 'timelapse.mp4'];
  await storageService.copyFile({ logger, sourceFilePath: videoPath, destinationFilePath: videoPathOnDisk });
  //

  const stat = await storageService.fileStat({ logger, filePath: videoPathOnDisk });

  const video = await fileService.createFile({
    logger,
    date,
    user: userId,
    camera: camera._id,
    parent: videosFolder._id,
    pathOnDisk: videoPathOnDisk,
    name: videoName,
    type: type.VIDEO,
    fileType: fileType.VIDEO_MP4,
    fileCreateType: create,
    data: undefined,
    videoData: {
      startDate: videoSettings.startDate,
      endDate: videoSettings.endDate,
      fps: videoSettings.fps,
      duration: videoSettings.duration,
      poster: null, // photo id
      size: stat.size,
    },
  });
  return video;
};

export default createAndSaveVideo;
