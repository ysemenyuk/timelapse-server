import mongoose from 'mongoose';

const TaskSchema = mongoose.Schema({
  user: { type: mongoose.ObjectId, ref: 'User' },
  camera: { type: mongoose.ObjectId, ref: 'Camera' },

  createdAt: { type: Date, default: new Date() },
  startedAt: { type: Date },
  stoppedAt: { type: Date },
  finishedAt: { type: Date },

  name: { type: String }, // CreatePhoto, CreateVideo, CreatePhotosByTime, CreateVideosByTime
  type: { type: String }, // OneTime, RepeatEvery
  status: { type: String, default: 'Created' }, // Created, Running, Stopped, Successed, Failed, Canceled
  removable: { type: Boolean, default: true },
  message: { type: String, default: '' },

  photoSettings: {
    photoUrl: { type: String }, // url
    timeRangeType: { type: String }, // allTime, customTime, sunTime
    startTime: { type: String }, // default 08:00
    endTime: { type: String }, // default 20:00
    interval: { type: Number }, // seconds
  },

  videoSettings: {
    customName: { type: String },
    dateRangeType: { type: String }, // allDates, customDates
    dateRange: { type: String }, // lastDay, lastWeek, lastMonth
    startDate: { type: String }, // dateString
    endDate: { type: String }, // dateString
    timeRangeType: { type: String }, // allTime, customTime
    startTime: { type: String }, // timeString
    endTime: { type: String }, // timeString
    interval: { type: String }, // oneTimeMonth, oneTimeWeek, oneTimeDay
    duration: { type: Number }, // seconds
    fps: { type: Number }, // fps
    deletExistingFile: { type: String }, // yes, no
  },
});

const Task = mongoose.model('Task', TaskSchema);

export default Task;
