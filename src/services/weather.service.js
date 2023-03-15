// import axios from 'axios';
// import config from '../config.js';

export default class WeatherService {
  constructor(container) {
    this.config = container.config;
    this.httpService = container.httpService;
  }

  async getCurrentDateWeather(location) {
    const [lat, lon] = location;

    // const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${config.weatherApiKey}&units=metric`;

    const url = `https://api.openweathermap.org/data/2.5/weather`;

    const params = {
      lat,
      lon,
      appid: this.config.weatherApiKey,
      units: 'metric',
    };

    try {
      const data = await this.httpService.getData(url, { params });
      return data;
    } catch (error) {
      console.log('error', error);
    }
  }
}
