import mongoose from 'mongoose';

const FileSchema = mongoose.Schema({
  date: { type: Date, default: new Date() },

  user: { type: mongoose.ObjectId, ref: 'User' },
  camera: { type: mongoose.ObjectId, ref: 'Camera' },
  task: { type: mongoose.ObjectId, ref: 'Task' },

  name: { type: String, required: true },
  type: { type: String, required: true }, // photo, video, poster
  fileType: { type: String }, // image/jpg, video/mp4
  createType: { type: String }, // byHand, byTime
  removable: { type: Boolean, default: true },

  size: { type: Number },
  link: { type: String },
  poster: { type: mongoose.ObjectId, ref: 'File' }, // for videoFile

  photoFileData: {
    photoUrl: { type: String },
  },

  videoFileData: {
    startDate: { type: Date },
    endDate: { type: Date },
    duration: { type: Number },
    fps: { type: Number },
  },
});

const File = mongoose.model('File', FileSchema);

export default File;
