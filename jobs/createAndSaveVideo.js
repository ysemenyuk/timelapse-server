import fileService from '../services/file.service.js';
import { makeNumber, makePosterFileName, makeUniformSample, makeVideoFileName } from '../utils/utils.js';
import { fileType, type } from '../utils/constants.js';
import diskService from '../services/disk.service.js';
import storageService from '../storage/index.js';
import ffmpegService from '../services/ffmpeg.service.js';

const sleep = (time, message = 'Hello') =>
  new Promise((resolve) => {
    setTimeout(() => resolve(message), time);
  });

const createAndSaveVideo = async ({ logger, userId, cameraId, taskId, create, videoSettings }) => {
  //
  console.log('videoSettings', videoSettings);

  const { customName, duration, fps, startDate, endDate, timeRangeType, customTimeStart, customTimeEnd } =
    videoSettings;

  const isCustomTime = timeRangeType === 'customTime';

  // create tmp-dir on disk
  const tmpdir = await diskService.createTmpDir({ logger });
  console.log('createTmpDir', tmpdir);

  // getFile from DB
  const query = {
    type: 'photo',
    date_gte: startDate,
    date_lte: endDate,
    ...(isCustomTime && { time_gte: customTimeStart, time_lte: customTimeEnd }),
  };

  const photos = await fileService.getFilesForVideo({ logger, cameraId, query });
  console.log('photos.length', photos.length);

  // make sample
  const samplingOfPhotos = makeUniformSample(photos, duration, fps);
  console.log('samplingOfPhotos.length', samplingOfPhotos.length);

  // isFileExistInStorage
  const checkedp = samplingOfPhotos.map(async (file) => {
    const isFileExistInStorage = await storageService.isFileExist({ file });
    if (isFileExistInStorage) {
      return file;
    }
    return null;
  });
  const checked = await Promise.all(checkedp);
  const existing = checked.filter((file) => file);
  console.log('existing.length', existing.length);
  //

  // download and rename files in tmp-dir from storage
  const savedp = existing.map(async (photo, index) => {
    const stream = storageService.openDownloadStream({ file: photo });
    const fileName = `img-${makeNumber(index)}.jpg`;
    const saved = await diskService.saveFile({ dir: tmpdir, fileName, stream });
    return saved;
  });
  const saved = await Promise.all(savedp);
  console.log('saved.length', saved.length);

  // create tmp-video on disk

  const tmpvideo = await ffmpegService.makeVideoFromPhotos({ pathToDir: tmpdir, fps: fps });
  console.log('tmpvideo', tmpvideo);

  // info
  const videoinfo = await ffmpegService.getVideoInfo({ pathToDir: tmpdir, videoName: tmpvideo });
  console.log('videoinfo.format.duration', videoinfo.format.duration);

  // create tmp-poster
  const tmpposter = await ffmpegService.makeVideoPoster({ pathToDir: tmpdir, videoName: tmpvideo });
  console.log('tmpposter', tmpposter);

  // create poster and upload in storage
  // create video and upload in storage

  const date = new Date();

  const posterFileName = makePosterFileName(date);
  const videoFileName = makeVideoFileName(date);

  const posterFileStream = diskService.openDownloadStream({ logger, dir: tmpdir, fileName: tmpposter });
  const videoFileStream = diskService.openDownloadStream({ logger, dir: tmpdir, fileName: tmpvideo });

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

  // console.log('poster', poster);

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
      duration: videoinfo.format.duration,
      fps: fps,
    },
    stream: videoFileStream,
  });

  // console.log('video', video);

  // remove tmp-dir from disk
  await diskService.removeDir({ logger, dir: tmpdir });
  console.log('removeTmpDir', tmpdir);

  await sleep(10 * 1000); // doing job

  return video;
};

export default createAndSaveVideo;
