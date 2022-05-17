import mongoose from 'mongoose';

const CameraTaskSchema = mongoose.Schema({
  user: { type: mongoose.ObjectId, ref: 'User' },
  camera: { type: mongoose.ObjectId, ref: 'Camera' },
  createdAt: { type: Date, default: new Date() },
  startedAt: { type: Date },
  finishedAt: { type: Date },
  type: { type: String }, // creteScreenshot, creteScreenshotsByTime
  status: { type: String }, // running, finished, stopped, failed
  job: { type: mongoose.ObjectId },
  screenshotsByTime: {
    interval: { type: Number },
    startTime: { type: String },
    stopTime: { type: String },
    totalScreenshots: { type: Number },
  },
});

const CameraTask = mongoose.model('CameraTask', CameraTaskSchema);

export default CameraTask;
