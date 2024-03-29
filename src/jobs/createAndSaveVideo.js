import {
  makeDateString,
  makeNumber,
  makePosterFileName,
  makeUniformSample,
  makeVideoFileName,
} from '../utils/index.js';
import { fileType, type } from '../utils/constants.js';
import { getDateRangeForVideo, getTimeRangeForVideo } from './helpers.js';

//

export default async ({ services, logger, userId, cameraId, taskId, createType, videoSettings }) => {
  const { videoService, storageService, fsService, fileService } = services;
  //
  console.log('videoSettings', videoSettings);

  const { startDate, endDate } = getDateRangeForVideo(videoSettings, createType);
  const { startTime, endTime } = getTimeRangeForVideo(videoSettings, createType);
  const { customName, duration, fps } = videoSettings;

  // create tmp-dir on disk
  const tmpdir = await fsService.createTmpDir();
  console.log('createTmpDir', tmpdir);

  // getFile from DB
  const query = {
    type: 'photo',
    ...(startDate && { date_gte: startDate }),
    ...(endDate && { date_lte: endDate }),
    ...(startTime && { time_gte: startTime }),
    ...(endTime && { time_lte: endTime }),
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

  if (existing.length < 300) {
    throw new Error('no files for video');
  }

  const firstFile = existing[0];
  const lastFile = existing[existing.length - 1];

  const realStartDate = makeDateString(new Date(firstFile.date));
  const realEndDate = makeDateString(new Date(lastFile.date));

  // download and rename files in tmp-dir from storage
  const savedp = existing.map(async (photo, index) => {
    const stream = storageService.openDownloadStream({ file: photo });
    const fileName = `img-${makeNumber(index)}.jpg`;
    const saved = await fsService.saveFile({ dir: tmpdir, file: fileName, stream });
    return saved;
  });

  const saved = await Promise.all(savedp);
  console.log('saved.length', saved.length);

  // create tmp-video on disk

  const tmpvideo = await videoService.makeVideoFromPhotos({ pathToDir: tmpdir, fps: fps });
  console.log('tmpvideo', tmpvideo);

  // info
  const videoinfo = await videoService.getVideoInfo({ pathToDir: tmpdir, videoName: tmpvideo });
  console.log('videoinfo.format.duration', videoinfo.format.duration);

  // create tmp-poster
  const tmpposter = await videoService.makeVideoPoster({ pathToDir: tmpdir, videoName: tmpvideo });
  console.log('tmpposter', tmpposter);

  // create poster and upload in storage
  // create video and upload in storage

  const date = new Date();

  const posterFileName = makePosterFileName(date);
  const videoFileName = makeVideoFileName(date);

  const posterFileStream = fsService.openDownloadStream({ dir: tmpdir, file: tmpposter });
  const videoFileStream = fsService.openDownloadStream({ dir: tmpdir, file: tmpvideo });

  const poster = await fileService.createFile({
    logger,
    stream: posterFileStream,
    payload: {
      date,
      user: userId,
      camera: cameraId,
      task: taskId,
      name: posterFileName,
      type: type.POSTER,
      fileType: fileType.IMAGE_JPG,
      createType: null,
      photoFileData: {},
    },
  });

  // console.log('poster', poster);

  const video = await fileService.createFile({
    logger,
    stream: videoFileStream,
    payload: {
      date,
      user: userId,
      camera: cameraId,
      task: taskId,
      name: videoFileName,
      type: type.VIDEO,
      fileType: fileType.VIDEO_MP4,
      createType: createType,
      poster: poster._id,
      videoFileData: {
        customName: customName || null,
        startDate: realStartDate || null,
        endDate: realEndDate || null,
        startTime: startTime || null,
        endTime: endTime || null,
        fps: fps,
        duration: videoinfo.format.duration,
      },
    },
  });

  // console.log('video', video);

  // remove tmp-dir from disk
  await fsService.removeDir({ dir: tmpdir });
  console.log('removeTmpDir', tmpdir);

  return video;
};
