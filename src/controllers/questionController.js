const questionService = require('../services/questionService');
const mongoose = require('mongoose');

/**
 * GET /questions
 * Returns all questions with isLocked field based on user's plan.
 */
const getAllQuestions = async (req, res) => {
  try {
    const questions = await questionService.getAllQuestions(req.user.plan);

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    console.error('Get all questions error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * GET /questions/:id
 * Returns a single question. Answer is included only if user's plan allows access.
 */
const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID format',
      });
    }

    const question = await questionService.getQuestionById(id, req.user.plan);

    // If access is restricted, return 403 with upgrade message
    if (question.message) {
      return res.status(403).json({
        success: false,
        data: {
          id: question.id,
          title: question.title,
          difficulty: question.difficulty,
          isPremium: question.isPremium,
          isLocked: question.isLocked,
        },
        message: question.message,
      });
    }

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.error('Get question by ID error:', error.message);

    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

module.exports = {
  getAllQuestions,
  getQuestionById,
};
