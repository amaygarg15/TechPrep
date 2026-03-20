const userService = require('../services/userService');

/**
 * GET /auth/profile
 * Returns the authenticated user's profile.
 */
const getProfile = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user.firebase_uid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        firebase_uid: user.firebase_uid,
        email: user.email,
        plan: user.plan,
        plan_activated_at: user.plan_activated_at,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = {
  getProfile,
};
