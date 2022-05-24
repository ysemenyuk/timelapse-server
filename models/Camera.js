import mongoose from 'mongoose';

const CameraSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },

  screenshotLink: { type: String, default: '' },
  rtspLink: { type: String, default: '' },

  user: { type: mongoose.ObjectId, ref: 'User' },
  avatar: { type: mongoose.ObjectId, ref: 'CameraFile' },

  mainFolder: { type: mongoose.ObjectId, ref: 'CameraFile' },
  screenshotsFolder: { type: mongoose.ObjectId, ref: 'CameraFile' },
  screenshotsByTimeFolder: { type: mongoose.ObjectId, ref: 'CameraFile' },
  videosFolder: { type: mongoose.ObjectId, ref: 'CameraFile' },
  videosByTimeFolder: { type: mongoose.ObjectId, ref: 'CameraFile' },

  screenshotsTask: { type: mongoose.ObjectId, ref: 'CameraTask' },
  videosTask: { type: mongoose.ObjectId, ref: 'CameraTask' },
  screenshotsByTimeTask: { type: mongoose.ObjectId, ref: 'CameraTask' },
  videosByTimeTask: { type: mongoose.ObjectId, ref: 'CameraTask' },
});

const Camera = mongoose.model('Camera', CameraSchema);

export default Camera;
