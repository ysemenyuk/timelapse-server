import mongoose from 'mongoose';

const TaskSchema = mongoose.Schema({
  user: { type: mongoose.ObjectId, ref: 'User' },
  camera: { type: mongoose.ObjectId, ref: 'Camera' },

  createdAt: { type: Date, default: new Date() },
  startedAt: { type: Date },
  stoppedAt: { type: Date },
  finishedAt: { type: Date },

  name: { type: String }, // CreatePhoto, CreateVideo, CreatePhotosByTime, ...
  type: { type: String }, // OneTime, RepeatEvery, RepeatAt
  status: { type: String, default: 'Created' }, // Created, Ready, Running, Stopped, Successed, Failed, Canceled
  removable: { type: Boolean, default: true },
  message: { type: String, default: '' },

  photoSettings: {
    // CreatePhoto
    photoUrl: { type: String }, // url
    // CreatePhotosByTime
    interval: { type: Number }, // seconds
    startTime: { type: String },
    stopTime: { type: String },
    bySun: { type: Boolean },
  },

  videoSettings: {
    // CreateVideo
    fileName: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    duration: { type: Number }, // seconds
    fps: { type: Number }, // frame per second
    // CreateVideosByTime
    periodicity: { type: String }, // everyDay, everyWeek, everyMonth
    createTime: { type: String }, // time for make video file
  },
});

const Task = mongoose.model('Task', TaskSchema);

export default Task;
