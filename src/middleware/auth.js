const { admin } = require('../config/firebase');
const userService = require('../services/userService');

/**
 * Authentication Middleware
 * Verifies Firebase ID token and attaches user info to req.user.
 * Auto-creates a new user record on first login with plan = 'free'.
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided. Please include a valid Firebase ID token in the Authorization header as: Bearer <token>',
      });
    }

    const token = authHeader.split('Bearer ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Token is empty.',
      });
    }

    // Verify the Firebase ID token — this is the real verification, NOT skipped
    const decodedToken = await admin.auth().verifyIdToken(token);

    const { uid, email } = decodedToken;

    // Find existing user or auto-create on first login
    let user = await userService.findUserByFirebaseUid(uid);

    if (!user) {
      user = await userService.createUser({
        firebase_uid: uid,
        email: email || decodedToken.email || 'unknown',
        plan: 'free',
        plan_activated_at: null,
      });
      console.log(`New user auto-created: ${email} (plan: free)`);
    }

    // Attach user data to request — plan is read from DB, NOT hardcoded
    req.user = {
      firebase_uid: uid,
      email: user.email,
      plan: user.plan,
      plan_activated_at: user.plan_activated_at,
      _id: user._id,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);

    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please sign in again.',
      });
    }

    if (error.code === 'auth/argument-error' || error.code === 'auth/id-token-revoked') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please provide a valid Firebase ID token.',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Invalid or expired token.',
    });
  }
};

module.exports = { authenticate };
