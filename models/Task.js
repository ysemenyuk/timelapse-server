import mongoose from 'mongoose';

const TaskSchema = mongoose.Schema({
  user: { type: mongoose.ObjectId, ref: 'User' },
  camera: { type: mongoose.ObjectId, ref: 'Camera' },

  createdAt: { type: Date, default: new Date() },
  startedAt: { type: Date },
  stoppedAt: { type: Date },
  finishedAt: { type: Date },

  name: { type: String }, // CreatePhoto, CreateVideo, CreatePhotosByTime, ...
  type: { type: String }, // OneTime, RepeatEvery
  status: { type: String, default: 'Created' }, // Created, Running, Stopped, Successed, Failed, Canceled
  removable: { type: Boolean, default: true },
  message: { type: String, default: '' },

  photoSettings: {
    // CreatePhoto
    photoUrl: { type: String }, // url
    // CreatePhotosByTime
    interval: { type: Number }, // seconds
    timeRangeType: { type: String }, // allTime, sunTime, customTime
    customTimeStart: { type: String }, // 08:00
    customTimeStop: { type: String }, // 20:00
  },

  videoSettings: {
    // CreateVideo
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

const Task = mongoose.model('Task', TaskSchema);

export default Task;
