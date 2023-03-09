import axios from 'axios';
import config from '../config.js';

const getCurrentDateWeather = async (location) => {
  const [lat, lon] = location;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${config.weatherApiKey}&units=metric`;
  try {
    const resp = await axios.get(url);
    // console.log('resp.status', resp.status);
    // console.log('resp.data', resp.data);

    return resp.data;
  } catch (error) {
    console.log('error', error);
  }
};

export default { getCurrentDateWeather };
