import sharp from 'sharp';

const resize = (size) => {
  return sharp().resize(size);
};

const resizeImage = (path, size) => {
  return sharp(path).resize(size).toBuffer();
};

export default { resize, resizeImage };
