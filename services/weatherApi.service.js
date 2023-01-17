import axios from 'axios';

const apiKey = process.env.WEATHER_API_KEY;

const getCurrentDateWeather = async ({ location }) => {
  const [lat, lon] = location;
  const url = `ttps://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metrics`;
  try {
    const resp = await axios.get(url);
    // console.log('resp.status', resp.status);
    return resp.data;
  } catch (error) {
    console.log('error', error);
  }
};

export default { getCurrentDateWeather };
