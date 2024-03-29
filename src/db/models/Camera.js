import mongoose from 'mongoose';

const CameraSchema = mongoose.Schema(
  {
    date: { type: Date, default: new Date() },
    name: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String },

    location: {
      latitude: { type: String, default: null },
      longitude: { type: String, default: null },
    },

    model: { type: String },
    photoUrl: { type: String, default: '' },
    rtspUrl: { type: String, default: '' },

    user: { type: mongoose.ObjectId, ref: 'User' },
    avatar: { type: mongoose.ObjectId, ref: 'File' },
  },
  {
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true }, // So `toObject()` output includes virtuals
  }
);

CameraSchema.virtual('lastPhoto', {
  ref: 'File',
  localField: '_id',
  foreignField: 'camera',
  match: { type: ['photo'] },
  justOne: true,
  options: { sort: { _id: -1 } },
});

CameraSchema.virtual('firstPhoto', {
  ref: 'File',
  localField: '_id',
  foreignField: 'camera',
  match: { type: ['photo'] },
  justOne: true,
  options: { sort: { _id: 1 } },
});

CameraSchema.virtual('totalPhotos', {
  ref: 'File',
  localField: '_id',
  foreignField: 'camera',
  count: true,
  justOne: false,
  match: { type: ['photo'] },
});

CameraSchema.virtual('lastVideo', {
  ref: 'File',
  localField: '_id',
  foreignField: 'camera',
  match: { type: ['video'] },
  justOne: true,
  options: { sort: { _id: -1 } },
});

CameraSchema.virtual('firstVideo', {
  ref: 'File',
  localField: '_id',
  foreignField: 'camera',
  match: { type: ['video'] },
  justOne: true,
  options: { sort: { _id: 1 } },
});

CameraSchema.virtual('totalVideos', {
  ref: 'File',
  localField: '_id',
  foreignField: 'camera',
  count: true,
  justOne: false,
  match: { type: ['video'] },
});

CameraSchema.virtual('photosByTimeTask', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'camera',
  justOne: true,
  match: { name: ['CreatePhotosByTime'] },
});

const Camera = mongoose.model('Camera', CameraSchema);

export default Camera;
