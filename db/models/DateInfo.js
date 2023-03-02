import mongoose from 'mongoose';

const DateInfoSchema = mongoose.Schema({
  date: { type: Date, default: new Date() },
  user: { type: mongoose.ObjectId, ref: 'User' },
  camera: { type: mongoose.ObjectId, ref: 'Camera' },

  name: { type: String, required: true }, // date?
  weather: { type: Object },
});

const DateInfo = mongoose.model('DateInfo', DateInfoSchema);

export default DateInfo;
