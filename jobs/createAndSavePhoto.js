import fileService from '../services/file.service.js';
import cameraService from '../services/camera.service.js';
import cameraApi from '../services/cameraApi.service.js';
import { makePhotoName, makePhotoNameOnDisk, makeCurrentDateName } from '../utils/index.js';
import { fileType, folderType, type } from '../utils/constants.js';

const createAndSavePhoto = async ({ logger, userId, cameraId, create, url }) => {
  const camera = await cameraService.getOneById({ cameraId });
  const { photosFolder } = camera;

  const date = new Date();
  const currentDateName = makeCurrentDateName(date);

  let parent = await fileService.getOne({
    logger,
    camera: cameraId,
    parent: photosFolder._id,
    name: currentDateName,
  });

  // TODO: check folder on disk?

  if (!parent) {
    parent = await fileService.createFolder({
      logger,
      user: userId,
      camera: cameraId,
      parent: photosFolder._id,
      name: currentDateName,
      pathOnDisk: [...photosFolder.pathOnDisk, currentDateName],
      type: type.FOLDER,
      folderType: folderType.DATE,
    });
  }

  const photoName = makePhotoName(date);
  const photoNameOnDisk = makePhotoNameOnDisk(date);
  const photoPathOnDisk = [...parent.pathOnDisk, photoNameOnDisk];

  const getUrl = url || camera.photoUrl;
  const fileData = await cameraApi.getPhotoByHttpRequest(getUrl, 'arraybuffer');

  const photo = await fileService.createFile({
    logger,
    date,
    user: userId,
    camera: cameraId,
    parent: parent._id,
    pathOnDisk: photoPathOnDisk,
    name: photoName,
    type: type.PHOTO,
    fileType: fileType.IMAGE_JPG,
    fileCreateType: create,
    data: fileData,
    photoData: {
      photoUrl: getUrl,
    },
  });

  return photo;
};

export default createAndSavePhoto;
