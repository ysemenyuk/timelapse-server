import mongoose from 'mongoose';

const CameraSchema = mongoose.Schema({
  date: { type: Date, default: new Date() },

  name: { type: String, required: true },
  description: { type: String, required: true },
  cameraModel: { type: String },

  photoUrl: { type: String, default: '' },
  rtspUrl: { type: String, default: '' },

  user: { type: mongoose.ObjectId, ref: 'User' },
  avatar: { type: mongoose.ObjectId, ref: 'CameraFile' },

  mainFolder: { type: mongoose.ObjectId, ref: 'CameraFile' },
  photosFolder: { type: mongoose.ObjectId, ref: 'CameraFile' },
  photosByTimeFolder: { type: mongoose.ObjectId, ref: 'CameraFile' },
  videosFolder: { type: mongoose.ObjectId, ref: 'CameraFile' },
  videosByTimeFolder: { type: mongoose.ObjectId, ref: 'CameraFile' },

  photosByTimeTask: { type: mongoose.ObjectId, ref: 'CameraTask' },
  videosByTimeTask: { type: mongoose.ObjectId, ref: 'CameraTask' },
});

const Camera = mongoose.model('Camera', CameraSchema);

export default Camera;
