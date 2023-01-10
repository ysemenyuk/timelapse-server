import mongoose from 'mongoose';

const CameraFileSchema = mongoose.Schema({
  date: { type: Date, default: new Date() },
  user: { type: mongoose.ObjectId, ref: 'User' },
  camera: { type: mongoose.ObjectId, ref: 'Camera' },

  parent: { type: mongoose.ObjectId, ref: 'CameraFile' },

  pathOnDisk: { type: [{ type: String }], required: true },
  nameOnDisk: { type: String, required: true },

  name: { type: String, required: true },
  type: { type: String }, // folder(date), photo, video
  createType: { type: String }, // byHand, byTime
  fileType: { type: String }, // image/jpg, image/png, video/mpeg, video/mp4
  removable: { type: Boolean, default: true },

  folderData: {
    // folderData (dateData) Weather?
  },

  photoData: {
    photoUrl: { type: String },
    size: { type: Number }, // ??
  },

  videoData: {
    startDate: { type: Date },
    endDate: { type: Date },
    duration: { type: Number }, // video duration seconds
    fps: { type: Number },
    poster: { type: mongoose.ObjectId, ref: 'CameraFile' }, // photo
    size: { type: Number }, // ??
  },
});

const CameraFile = mongoose.model('CameraFile', CameraFileSchema);

export default CameraFile;
