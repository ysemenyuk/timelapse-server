import mongoose from 'mongoose';

const CameraFileSchema = mongoose.Schema({
  date: { type: Date, default: new Date() },
  user: { type: mongoose.ObjectId, ref: 'User' },
  camera: { type: mongoose.ObjectId, ref: 'Camera' },
  parent: { type: mongoose.ObjectId, ref: 'CameraFile' },
  pathOnDisk: { type: [{ type: String }], required: true },
  nameOnDisk: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String }, // folder, photo, photoByTime, video, videoByTime
  fileType: { type: String }, // image/jpg, video/mpeg, ...
  removable: { type: Boolean, default: true },
});

const CameraFile = mongoose.model('CameraFile', CameraFileSchema);

export default CameraFile;
