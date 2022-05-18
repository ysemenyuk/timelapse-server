import mongoose from 'mongoose';

const CameraFileSchema = mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, default: new Date() },
  user: { type: mongoose.ObjectId, ref: 'User' },
  camera: { type: mongoose.ObjectId, ref: 'Camera' },
  parent: { type: mongoose.ObjectId, ref: 'CameraFile' },
  children: [{ type: mongoose.ObjectId, ref: 'CameraFile' }],
  type: { type: String }, // screenshot, screenshotByTime, video, videoByTime, folder
  path: [{ type: String }],
  removable: { type: Boolean, default: true },
});

const CameraFile = mongoose.model('CameraFile', CameraFileSchema);

export default CameraFile;
