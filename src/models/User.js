const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firebase_uid: {
      type: String,
      required: [true, 'Firebase UID is required'],
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    plan: {
      type: String,
      enum: {
        values: ['free', 'pro', 'premium'],
        message: '{VALUE} is not a valid plan',
      },
      default: 'free',
    },
    plan_activated_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
