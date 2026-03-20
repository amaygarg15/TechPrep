const planService = require('../services/planService');

/**
 * POST /select-plan
 * Accepts plan type (pro or premium), simulates payment, updates user plan.
 */
const selectPlan = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!plan) {
      return res.status(400).json({
        success: false,
        message: 'Plan is required. Valid plans: pro, premium',
      });
    }

    const result = await planService.selectPlan(req.user.firebase_uid, plan);

    res.status(200).json({
      success: true,
      message: `Successfully upgraded to ${plan} plan`,
      data: result,
    });
  } catch (error) {
    console.error('Select plan error:', error.message);

    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

module.exports = {
  selectPlan,
};
