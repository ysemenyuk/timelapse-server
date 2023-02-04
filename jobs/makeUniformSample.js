const makeUniformSample = (photos, duration, fps = 25) => {
  const all = photos.length;
  const required = duration * fps;
  const step = all / required;

  const result = [];

  for (let i = 0; i < required; i++) {
    result.push(photos[Math.floor(i * step)]);
  }

  return result;
};

export default makeUniformSample;
