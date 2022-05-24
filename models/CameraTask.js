import mongoose from 'mongoose';

const CameraTaskSchema = mongoose.Schema({
  user: { type: mongoose.ObjectId, ref: 'User' },
  camera: { type: mongoose.ObjectId, ref: 'Camera' },

  createdAt: { type: Date, default: new Date() },
  startedAt: { type: Date },
  stoppedAt: { type: Date },
  finishedAt: { type: Date },

  default: { type: Boolean, default: false },
  name: { type: String }, // CreateScreenshot, CreateVideo, // Screenshots, ScreenshotsByTime, Videos, VideosByTime,
  type: { type: String }, // Simple, Periodic,
  status: { type: String, default: 'Created' }, // Created, Ready, Running, Stopped, Successed, Failed, Canceled

  screenshotsByTimeSettings: {
    interval: { type: Number },
    startTime: { type: String },
    stopTime: { type: String },
  },

  videoSettings: {
    startDateTime: { type: String },
    endDateTime: { type: String },
    duration: { type: Number }, // video file duration seconds
    fps: { type: Number },
  },

  videosByTimeSettings: {
    startTime: { type: String }, // time for make video file
    duration: { type: Number }, // video file duration seconds
    fps: { type: Number },
  },
});

const CameraTask = mongoose.model('CameraTask', CameraTaskSchema);

export default CameraTask;
