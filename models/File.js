import mongoose from 'mongoose';

const FileSchema = mongoose.Schema({
  date: { type: Date, default: new Date() },
  user: { type: mongoose.ObjectId, ref: 'User' },
  camera: { type: mongoose.ObjectId, ref: 'Camera' },
  task: { type: mongoose.ObjectId, ref: 'Task' },

  path: { type: [{ type: String }] },
  url: { type: String },

  name: { type: String, required: true },
  type: { type: String, required: true }, // photo, video, zip
  fileType: { type: String }, // image/jpg, image/png, video/mpeg, video/mp4, .. zip
  createType: { type: String }, // byHand, byTime
  removable: { type: Boolean, default: true },

  size: { type: Number },

  metaData: {
    // photo
    photoUrl: { type: String },
    // video
    startDate: { type: Date },
    endDate: { type: Date },
    duration: { type: Number },
    fps: { type: Number },
    poster: { type: mongoose.ObjectId, ref: 'File' },
  },
});

const File = mongoose.model('File', FileSchema);

export default File;
