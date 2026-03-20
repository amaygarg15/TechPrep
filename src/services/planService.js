const userService = require('./userService');

const VALID_PLANS = ['pro', 'premium'];

/**
 * Select / upgrade a user's plan (mock payment flow).
 * Simulates a successful payment and updates the plan.
 */
const selectPlan = async (firebaseUid, plan) => {
  // Validate plan type
  if (!plan || !VALID_PLANS.includes(plan)) {
    const error = new Error(
      `Invalid plan: "${plan}". Must be one of: ${VALID_PLANS.join(', ')}`
    );
    error.statusCode = 400;
    throw error;
  }

  // Check if user exists
  const existingUser = await userService.findUserByFirebaseUid(firebaseUid);
  if (!existingUser) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if already on the same plan
  if (existingUser.plan === plan) {
    const error = new Error(`You are already on the ${plan} plan`);
    error.statusCode = 400;
    throw error;
  }

  // --- Mock Payment Processing ---
  // In a real app, this is where you'd integrate with Stripe/Razorpay etc.
  // We simulate a successful payment:
  const mockPayment = {
    transaction_id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status: 'success',
    plan: plan,
    amount: plan === 'pro' ? 999 : 1999, // mock amounts in cents
    currency: 'USD',
    timestamp: new Date().toISOString(),
  };

  // Update user plan after "successful payment"
  const updatedUser = await userService.updateUserPlan(firebaseUid, plan);

  return {
    user: {
      firebase_uid: updatedUser.firebase_uid,
      email: updatedUser.email,
      plan: updatedUser.plan,
      plan_activated_at: updatedUser.plan_activated_at,
    },
    payment: mockPayment,
  };
};

module.exports = {
  selectPlan,
};
