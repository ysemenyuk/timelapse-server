import mongoose from 'mongoose';

const CameraFileSchema = mongoose.Schema({
  date: { type: Date, default: new Date() },
  user: { type: mongoose.ObjectId, ref: 'User' },
  camera: { type: mongoose.ObjectId, ref: 'Camera' },

  parent: { type: mongoose.ObjectId, ref: 'CameraFile' },

  pathOnDisk: { type: [{ type: String }], required: true },
  nameOnDisk: { type: String, required: true },

  name: { type: String, required: true },

  photoByHand: {
    photoUrl: { type: String },
  },

  videoByHand: {
    startDate: { type: Date },
    endDate: { type: Date },
    duration: { type: Number }, // video duration seconds
    fps: { type: Number },
    poster: { type: mongoose.ObjectId, ref: 'CameraFile' },
    size: { type: Number }, // ??
  },

  type: { type: String }, // folder, photoByHand, photoByTime, videoByHand, videoByTime
  fileType: { type: String }, // image/jpg, video/mpeg, ...
  removable: { type: Boolean, default: true },
});

const CameraFile = mongoose.model('CameraFile', CameraFileSchema);

export default CameraFile;
