import axios from 'axios';

// const { data } = await axios.get(url, { responseType: 'arraybuffer' });
// const { data } = await axios.get(url, { responseType: 'stream' });

const getScreenshot = async (url, responseType) => {
  const { data } = await axios.get(url, { responseType });
  return data;
};

export default { getScreenshot };
