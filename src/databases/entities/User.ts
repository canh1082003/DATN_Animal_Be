import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'ai'], default: 'user' },
    verifyEmailToken: { type: String, require: false },
    isVerifyEmail: { type: Boolean, default: false },
  },
  { timestamps: true, collection: 'users' }
);

const User = mongoose.model('User', UserSchema);
export default User;
