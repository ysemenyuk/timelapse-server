import mongoose from 'mongoose';

const CameraTaskSchema = mongoose.Schema({
  user: { type: mongoose.ObjectId, ref: 'User' },
  camera: { type: mongoose.ObjectId, ref: 'Camera' },

  createdAt: { type: Date, default: new Date() },
  startedAt: { type: Date },
  stoppedAt: { type: Date },
  finishedAt: { type: Date },

  type: { type: String }, // createScreenshot, screenshotsByTime, createVideo, videosByTime,
  status: { type: String, default: 'Created' }, // created, running, stopped, finished, failed

  screenshotsByTimeTotalFiles: { type: Number },
  screenshotsByTimeSettings: {
    interval: { type: Number },
    startTime: { type: String },
    stopTime: { type: String },
  },

  videosByTimeTotalFiles: { type: Number },
  videosByTimeSettings: {
    length: { type: Number }, // video length seconds
    startTime: { type: String }, // time for create video file
  },
});

const CameraTask = mongoose.model('CameraTask', CameraTaskSchema);

export default CameraTask;
