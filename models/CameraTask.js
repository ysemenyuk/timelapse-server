import mongoose from 'mongoose';

const CameraTaskSchema = mongoose.Schema({
  user: { type: mongoose.ObjectId, ref: 'User' },
  camera: { type: mongoose.ObjectId, ref: 'Camera' },

  createdAt: { type: Date, default: new Date() },
  startedAt: { type: Date },
  stoppedAt: { type: Date },
  finishedAt: { type: Date },

  type: { type: String }, // Screenshot, ScreenshotsByTask, Video, VideosByTask,
  status: { type: String, default: 'Created' }, // Created, Running, Stopped, Finished, Failed

  screenshotsByTimeSettings: {
    interval: { type: Number },
    startTime: { type: String },
    stopTime: { type: String },
  },

  videoSettings: {
    startDate: { type: String },
    finishDate: { type: String },
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
