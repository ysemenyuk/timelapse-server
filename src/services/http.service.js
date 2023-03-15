import axios from 'axios';

// const { data } = await axios.get(url, { responseType: 'arraybuffer' });
// const { data } = await axios.get(url, { responseType: 'stream' });

const getData = async (url, settings) => {
  const { data } = await axios.get(url, settings);
  return data;
};

export default { getData };
