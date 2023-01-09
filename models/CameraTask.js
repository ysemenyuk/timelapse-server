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
  message: { type: String },

  settings: {
    // CreatePhoto
    photoUrl: { type: String },

    // CreateVideo
    startDate: { type: String },
    endDate: { type: String },
    duration: { type: Number }, // video duration seconds
    fps: { type: Number },

    // CreatePhotosByTime
    interval: { type: Number },
    startTime: { type: String },
    stopTime: { type: String },

    // CreateVideosByTime
    // startTime: { type: String }, // time for start make video file
    // duration: { type: Number }, // video duration seconds
    // fps: { type: Number },
  },
});

const CameraTask = mongoose.model('CameraTask', CameraTaskSchema);

export default CameraTask;
