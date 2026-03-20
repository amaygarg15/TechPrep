const User = require('../models/User');

/**
 * Find a user by their Firebase UID.
 */
const findUserByFirebaseUid = async (firebaseUid) => {
  return await User.findOne({ firebase_uid: firebaseUid });
};

/**
 * Create a new user record.
 */
const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

/**
 * Update a user's plan.
 */
const updateUserPlan = async (firebaseUid, plan) => {
  return await User.findOneAndUpdate(
    { firebase_uid: firebaseUid },
    {
      plan,
      plan_activated_at: new Date(),
    },
    { new: true, runValidators: true }
  );
};

/**
 * Get user profile by Firebase UID.
 */
const getUserProfile = async (firebaseUid) => {
  return await User.findOne({ firebase_uid: firebaseUid }).select('-__v');
};

module.exports = {
  findUserByFirebaseUid,
  createUser,
  updateUserPlan,
  getUserProfile,
};
