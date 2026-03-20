/**
 * Access Control Matrix
 *
 * Plan     | Questions | Answers | Premium Content
 * ---------|-----------|---------|----------------
 * Free     | ✅        | ❌      | ❌
 * Pro      | ✅        | ✅      | ❌
 * Premium  | ✅        | ✅      | ✅
 *
 * This logic is enforced at the backend level — NEVER assumed or hardcoded.
 */

const ACCESS_MATRIX = {
  free: {
    canViewQuestions: true,
    canViewAnswers: false,
    canViewPremiumContent: false,
  },
  pro: {
    canViewQuestions: true,
    canViewAnswers: true,
    canViewPremiumContent: false,
  },
  premium: {
    canViewQuestions: true,
    canViewAnswers: true,
    canViewPremiumContent: true,
  },
};

/**
 * Get access permissions for a given plan.
 * Always reads from the matrix — never hardcoded per-request.
 */
const getAccessPermissions = (plan) => {
  const permissions = ACCESS_MATRIX[plan];
  if (!permissions) {
    // Default to most restrictive if plan is somehow invalid
    return ACCESS_MATRIX.free;
  }
  return permissions;
};

/**
 * Check if a user can view the answer to a question.
 * @param {string} userPlan - The user's current plan (from DB)
 * @param {boolean} isPremium - Whether the question is premium content
 * @returns {boolean}
 */
const canAccessAnswer = (userPlan, isPremium) => {
  const permissions = getAccessPermissions(userPlan);

  // Cannot view any answers on free plan
  if (!permissions.canViewAnswers) {
    return false;
  }

  // Premium content requires premium plan
  if (isPremium && !permissions.canViewPremiumContent) {
    return false;
  }

  return true;
};

/**
 * Check if a question should be marked as locked for the user.
 * A question is "locked" if the user cannot access its answer.
 */
const isQuestionLocked = (userPlan, isPremium) => {
  return !canAccessAnswer(userPlan, isPremium);
};

module.exports = {
  ACCESS_MATRIX,
  getAccessPermissions,
  canAccessAnswer,
  isQuestionLocked,
};
