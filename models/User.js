import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
  name: { type: String, required: true, default: 'username' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  userFolder: { type: mongoose.ObjectId, ref: 'File' },
});

const File = mongoose.model('User', UserSchema);

export default File;
