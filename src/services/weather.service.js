// import axios from 'axios';

export default class WeatherService {
  constructor(httpService, config) {
    this.config = config;
    this.httpService = httpService;
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
