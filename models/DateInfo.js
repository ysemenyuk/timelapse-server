import mongoose from 'mongoose';

const DateInfoSchema = mongoose.Schema({
  date: { type: Date, default: new Date() },
  user: { type: mongoose.ObjectId, ref: 'User' },
  camera: { type: mongoose.ObjectId, ref: 'Camera' },

  currentDay: { type: String, required: true }, // date?

  metaData: {
    // Weather
    main: {
      temp: { type: Number }, // 298.48,
      temp_min: { type: Number }, // 297.56,
      temp_max: { type: Number }, // 300.05,
      pressure: { type: Number }, // 1015,
      humidity: { type: Number }, // 64,
    },
    wind: {
      speed: { type: Number }, // 0.62,
      deg: { type: Number }, // 349,
      gust: { type: Number }, // 1.18,
    },
    sys: {
      sunrise: { type: Number }, // 1661834187,
      sunset: { type: Number }, // 1661882248,
    },
  },
});

const DateInfo = mongoose.model('DateInfo', DateInfoSchema);

export default DateInfo;
