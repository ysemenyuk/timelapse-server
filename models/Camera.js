import mongoose from 'mongoose';

const CameraSchema = mongoose.Schema(
  {
    date: { type: Date, default: new Date() },
    name: { type: String, required: true },
    description: { type: String, required: true },
    cameraModel: { type: String },

    photoUrl: { type: String, default: '' },
    rtspUrl: { type: String, default: '' },

    user: { type: mongoose.ObjectId, ref: 'User' },
    avatar: { type: mongoose.ObjectId, ref: 'CameraFile' },

    mainFolder: { type: mongoose.ObjectId, ref: 'CameraFile' },
    photosByHandFolder: { type: mongoose.ObjectId, ref: 'CameraFile' },
    photosByTimeFolder: { type: mongoose.ObjectId, ref: 'CameraFile' },
    videosByHandFolder: { type: mongoose.ObjectId, ref: 'CameraFile' },
    videosByTimeFolder: { type: mongoose.ObjectId, ref: 'CameraFile' },

    photosByTimeTask: { type: mongoose.ObjectId, ref: 'CameraTask' },
    videosByTimeTask: { type: mongoose.ObjectId, ref: 'CameraTask' },
  },
  {
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true }, // So `toObject()` output includes virtuals
  }
);

CameraSchema.virtual('lastPhoto', {
  ref: 'CameraFile',
  localField: '_id',
  foreignField: 'camera',
  match: { type: ['photo'], createType: ['byHand', 'byTime'] },
  justOne: true,
  options: { sort: { _id: -1 } },
});

CameraSchema.virtual('firstPhoto', {
  ref: 'CameraFile',
  localField: '_id',
  foreignField: 'camera',
  match: { type: ['photo'], createType: ['byHand', 'byTime'] },
  justOne: true,
  options: { sort: { _id: 1 } },
});

CameraSchema.virtual('photosCount', {
  ref: 'CameraFile',
  localField: '_id',
  foreignField: 'camera',
  count: true,
  justOne: false,
  match: { type: ['photo'], createType: { $in: ['byHand', 'byTime'] } },
});

CameraSchema.virtual('lastVideo', {
  ref: 'CameraFile',
  localField: '_id',
  foreignField: 'camera',
  match: { type: ['video'], createType: ['byHand', 'byTime'] },
  justOne: true,
  options: { sort: { _id: -1 } },
});

CameraSchema.virtual('firstVideo', {
  ref: 'CameraFile',
  localField: '_id',
  foreignField: 'camera',
  match: { type: ['video'], createType: ['byHand', 'byTime'] },
  justOne: true,
  options: { sort: { _id: 1 } },
});

CameraSchema.virtual('videosCount', {
  ref: 'CameraFile',
  localField: '_id',
  foreignField: 'camera',
  count: true,
  justOne: false,
  match: { type: ['video'], createType: { $in: ['byHand', 'byTime'] } },
});

const Camera = mongoose.model('Camera', CameraSchema);

export default Camera;
