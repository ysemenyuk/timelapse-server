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

  dateString: { type: String },
  timeString: { type: String },

  photoFileData: {
    photoUrl: { type: String },
  },

  videoFileData: {
    customName: { type: String },
    startDate: { type: String }, // dateString
    endDate: { type: String }, // dateString
    timeRangeType: { type: String }, // allTime, customTime
    customTimeStart: { type: String }, // timeString
    customTimeEnd: { type: String }, // timeString
    duration: { type: Number }, // seconds
    fps: { type: Number }, // fps
  },
});

const File = mongoose.model('File', FileSchema);

export default File;
