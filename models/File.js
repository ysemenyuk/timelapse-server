import mongoose from 'mongoose';

const FileSchema = mongoose.Schema({
  date: { type: Date, default: new Date() },
  user: { type: mongoose.ObjectId, ref: 'User' },
  camera: { type: mongoose.ObjectId, ref: 'Camera' },

  parent: { type: mongoose.ObjectId, ref: 'File' },

  pathOnDisk: { type: [{ type: String }], required: true },
  nameOnDisk: { type: String },

  name: { type: String, required: true },
  type: { type: String, required: true }, // folder, photo, video, zip
  folderType: { type: String }, // default, date
  fileType: { type: String }, // image/jpg, image/png, video/mpeg, video/mp4
  fileCreateType: { type: String }, // byHand, byTime
  removable: { type: Boolean, default: true },

  folderData: {
    // folderData (dateData)
  },

  photoData: {
    photoUrl: { type: String },
    size: { type: Number }, // ??
  },

  videoData: {
    startDate: { type: Date },
    endDate: { type: Date },
    duration: { type: Number },
    fps: { type: Number },
    poster: { type: mongoose.ObjectId, ref: 'File' },
    size: { type: Number }, // ??
  },
});

const File = mongoose.model('File', FileSchema);

export default File;
