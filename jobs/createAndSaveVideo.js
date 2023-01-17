import fileService from '../services/file.service.js';
import { makeVideoName } from '../utils/index.js';
import { fileType, type } from '../utils/constants.js';
import diskStorage from '../storage/disk.storage.js';

const createAndSaveVideo = async ({ logger, userId, cameraId, taskId, create, videoSettings }) => {
  //
  // create tmp dir on disk
  // getFile from DB
  // download files in tmp dir from storage
  // rename files in tmp dir
  // create tmp video on disk
  // open stream and upload in storage
  // create and save poster

  const downloadStream = diskStorage.openDownloadStream({ logger, filePath: ['videos', 'timelapse.mp4'] });

  const date = new Date();
  const videoName = videoSettings.fileName || makeVideoName(date);

  const video = await fileService.createFile({
    logger,
    stream: downloadStream,
    date,
    user: userId,
    camera: cameraId,
    task: taskId,
    name: videoName,
    type: type.VIDEO,
    fileType: fileType.VIDEO_MP4,
    createType: create,
    metaData: {
      startDate: videoSettings.startDate,
      endDate: videoSettings.endDate,
      duration: videoSettings.duration,
      fps: videoSettings.fps,
      poster: null,
    },
  });

  // remove tmp dir
  // remove tmp video

  return video;
};

export default createAndSaveVideo;
