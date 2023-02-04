import fileService from '../services/file.service.js';
import { makeNumber, makePosterFileName, makeVideoFileName } from '../utils/utils.js';
import { fileType, type } from '../utils/constants.js';
import diskStorage from '../storage/disk.storage.js';
import storageService from '../services/storage.service.js';
import ffmpegService from '../services/ffmpeg.service.js';
import makeUniformSample from './makeUniformSample.js';
// import path from 'path';

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

  const photos = await fileService.getFilesForVideo({ logger, cameraId, query });
  console.log('photos.length', photos.length);

  // make sample
  const samplingOfPhotos = makeUniformSample(photos, duration, fps);
  console.log('samplingOfPhotos.length', samplingOfPhotos.length);

  // filter
  const filtered = samplingOfPhotos.filter((photo) => storageService.isFileExist({ file: photo }));
  console.log('filtered.length', filtered.length);

  // download and rename files in tmp-dir from storage
  const promises = filtered.map((photo, index) => {
    // if (!storageService.isFileExist({ file: photo })) {
    //   return null;
    // }
    const stream = storageService.openDownloadStream({ file: photo });
    const fileName = `img-${makeNumber(index)}.jpg`;
    const saved = diskStorage.saveFileInTmpDir({ tmpdir, fileName, stream });
    return saved;
  });
  console.log('promises.length', promises.length);

  const saved = await Promise.all(promises.filter((i) => i));
  console.log('saved.length', saved.filter((i) => i).length);

  // create tmp-video on disk

  const tmpvideo = await ffmpegService.makeVideoFileFromPhotos({ pathToDir: tmpdir, fps: fps });
  console.log('tmpvideo', tmpvideo);

  // info
  const videoinfo = await ffmpegService.getVideoInfo({ pathToDir: tmpdir, videoName: tmpvideo });
  console.log('videoinfo.format.duration', videoinfo.format.duration);

  // create tmp-poster
  const tmpposter = await ffmpegService.makeVideoPoster({ pathToDir: tmpdir, videoName: tmpvideo });
  console.log('tmpposter', tmpposter);

  // create poster and upload in storage
  // create video and upload in storage

  await sleep(5 * 1000); // doing job

  const date = new Date();

  const posterFileName = makePosterFileName(date);
  const videoFileName = makeVideoFileName(date);

  const posterFileStream = diskStorage.openDownloadStreamFromTmpDir({ logger, tmpdir, fileName: tmpposter });
  const videoFileStream = diskStorage.openDownloadStreamFromTmpDir({ logger, tmpdir, fileName: tmpvideo });

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
  const deleted = await diskStorage.removeTmpDir({ logger, tmpdir });
  console.log('deleted', deleted);

  return video;
};

export default createAndSaveVideo;
