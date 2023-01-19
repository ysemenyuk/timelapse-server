import fileService from '../services/file.service.js';
import { makePosterFileName, makeVideoFileName } from '../utils/utils.js';
import { fileType, type } from '../utils/constants.js';
import diskStorage from '../storage/disk.storage.js';

const sleep = (time, message = 'Hello') =>
  new Promise((resolve) => {
    setTimeout(() => resolve(message), time);
  });

const createAndSaveVideo = async ({ logger, userId, cameraId, taskId, create, videoSettings }) => {
  //
  // create tmp-dir on disk
  // getFile from DB
  // download files in tmp-dir from storage
  // rename files in tmp-dir
  // create tmp-video on disk
  // create poster and upload in storage
  // create video and upload in storage

  await sleep(1 * 1000); // doing job

  const date = new Date();

  const posterFileName = makePosterFileName(date);
  const posterFileStream = diskStorage.openDownloadStream({ logger, filePath: 'poster_timelapse.jpg' });

  const poster = await fileService.createFile({
    logger,
    date,
    user: userId,
    camera: cameraId,
    task: taskId,
    name: posterFileName,
    type: type.POSTER,
    fileType: fileType.IMAGE_JPG,
    createType: null,
    photoFileData: {},
    stream: posterFileStream,
  });

  // console.log('poster, poster);

  const videoFileName = videoSettings.fileName || makeVideoFileName(date);
  const videoFileStream = diskStorage.openDownloadStream({ logger, filePath: 'timelapse.mp4' });

  const video = await fileService.createFile({
    logger,
    date,
    user: userId,
    camera: cameraId,
    task: taskId,
    name: videoFileName,
    type: type.VIDEO,
    fileType: fileType.VIDEO_MP4,
    createType: create,
    poster: poster._id,
    videoFileData: {
      startDate: videoSettings.startDate,
      endDate: videoSettings.endDate,
      duration: videoSettings.duration,
      fps: videoSettings.fps,
    },
    stream: videoFileStream,
  });

  // remove tmp-dir from disk
  // remove tmp-video from disk

  return video;
};

export default createAndSaveVideo;
