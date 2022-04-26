import mongoose from 'mongoose';

const CameraFileSchema = mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, default: new Date() },
  user: { type: mongoose.ObjectId, ref: 'User' },
  camera: { type: mongoose.ObjectId, ref: 'Camera' },
  parent: { type: mongoose.ObjectId, ref: 'CameraFile' },
  children: [{ type: mongoose.ObjectId, ref: 'CameraFile' }],
  type: { type: String }, // image, imageByTime, video, videoByTime, folder
  storage: { type: String }, // disk, gridfs
  path: [{ type: String }],
});

const CameraFile = mongoose.model('CameraFile', CameraFileSchema);

export default CameraFile;
