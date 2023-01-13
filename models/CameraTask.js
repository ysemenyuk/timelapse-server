import mongoose from 'mongoose';

const CameraTaskSchema = mongoose.Schema({
  user: { type: mongoose.ObjectId, ref: 'User' },
  camera: { type: mongoose.ObjectId, ref: 'Camera' },

  createdAt: { type: Date, default: new Date() },
  startedAt: { type: Date },
  stoppedAt: { type: Date },
  finishedAt: { type: Date },

  name: { type: String }, // CreateOnePhoto, CreateOneVideo, CreatePhotosByTime, CreateVideosByTime,
  type: { type: String }, // OneTime, RepeatEvery, RepeatAt
  status: { type: String, default: 'Created' }, // Created, Ready, Running, Stopped, Successed, Failed, Canceled
  removable: { type: Boolean, default: true },
  message: { type: String },

  photoSettings: {
    // CreateOnePhoto
    photoUrl: { type: String }, // url
    // CreatePhotosByTime
    interval: { type: Number }, // seconds
    startTime: { type: String },
    stopTime: { type: String },
  },

  videoSettings: {
    // CreateOneVideo
    startDate: { type: String },
    endDate: { type: String },
    duration: { type: Number }, // seconds
    fps: { type: Number }, // frame per second
    // CreateVideosByTime
    periodicity: { type: String }, // everyDay, everyWeek
    createTime: { type: String }, // time for make video file
  },
});

const CameraTask = mongoose.model('CameraTask', CameraTaskSchema);

export default CameraTask;
