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
    photoUrlType: { type: String }, // cameraUrl, customUrl
    photoUrl: { type: String }, // url
    timeRangeType: { type: String }, // allTime, customTime, sunTime
    customTimeStart: { type: String }, // default 08:00
    customTimeStop: { type: String }, // default 20:00
    interval: { type: Number }, // seconds
  },

  videoSettings: {
    customName: { type: String },
    dateRangeType: { type: String }, // allDates, customDates, lastDay, lastWeek, lastMonth
    startDate: { type: String }, // dateString
    endDate: { type: String }, // dateString
    timeRangeType: { type: String }, // allTime, customTime
    customTimeStart: { type: String }, // timeString
    customTimeEnd: { type: String }, // timeString
    fps: { type: Number }, // fps
    duration: { type: Number }, // seconds
    interval: { type: String }, // cron format
  },
});

const Task = mongoose.model('Task', TaskSchema);

export default Task;
