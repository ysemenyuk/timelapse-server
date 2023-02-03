import fileService from '../services/file.service.js';
import { makePosterFileName, makeVideoFileName } from '../utils/utils.js';
import { fileType, type } from '../utils/constants.js';
import diskStorage from '../storage/disk.storage.js';
import storageService from '../services/storage.service.js';

const sleep = (time, message = 'Hello') =>
  new Promise((resolve) => {
    setTimeout(() => resolve(message), time);
  });

const createAndSaveVideo = async ({ logger, userId, cameraId, taskId, create, videoSettings }) => {
  //
  const { customName, duration, fps, startDate, endDate, timeRangeType, customTimeStart, customTimeEnd } =
    videoSettings;
  const isCustomTime = timeRangeType === 'customTime';
  //
  // create tmp-dir on disk
  const tmpdir = await diskStorage.createTmpDir({ logger });
  console.log('tmpdir', tmpdir);

  // getFile from DB
  const query = {
    type: 'photo',
    startDate: startDate,
    endDate: endDate,
    ...(isCustomTime && { startTime: customTimeStart, endTime: customTimeEnd }),
  };
  // console.log(333, query);
  const photos = await fileService.getManyByQuery({ logger, cameraId, query });
  // console.log('photos', photos);

  // download files in tmp-dir from storage
  const data = await storageService.downloadFile({ logger, file: photos[0] });
  const saved = await diskStorage.saveFileInTmpDir({ logger, tmpdir, fileName: photos[0].name, data });
  console.log('saved', saved);

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

  const videoFileName = makeVideoFileName(date);
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
      customName: customName,
      startDate: startDate,
      endDate: endDate,
      timeRangeType: timeRangeType,
      customTimeStart: customTimeStart,
      customTimeEnd: customTimeEnd,
      duration: duration,
      fps: fps,
    },
    stream: videoFileStream,
  });

  // remove tmp-dir from disk
  // const deleted = await diskStorage.removeTmpDir({ logger, tmpdir });
  // console.log('deleted', deleted);

  // remove tmp-video from disk

  return video;
};

export default createAndSaveVideo;
