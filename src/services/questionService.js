const Question = require('../models/Question');
const { isQuestionLocked, canAccessAnswer } = require('../middleware/accessControl');

/**
 * Get all questions with isLocked status based on user's plan.
 * Questions are always visible; isLocked indicates whether the answer is accessible.
 */
const getAllQuestions = async (userPlan) => {
  const questions = await Question.find({}).select('-__v').lean();

  return questions.map((question) => ({
    id: question._id,
    title: question.title,
    difficulty: question.difficulty,
    isPremium: question.isPremium,
    isLocked: isQuestionLocked(userPlan, question.isPremium),
  }));
};

/**
 * Get a single question by ID.
 * Returns the answer ONLY if the user's plan grants access.
 * Access is enforced at the backend — never assumed.
 */
const getQuestionById = async (questionId, userPlan) => {
  const question = await Question.findById(questionId).select('-__v').lean();

  if (!question) {
    const error = new Error('Question not found');
    error.statusCode = 404;
    throw error;
  }

  const hasAccess = canAccessAnswer(userPlan, question.isPremium);

  if (!hasAccess) {
    return {
      id: question._id,
      title: question.title,
      difficulty: question.difficulty,
      isPremium: question.isPremium,
      isLocked: true,
      message: 'Upgrade your plan to access this content',
    };
  }

  return {
    id: question._id,
    title: question.title,
    difficulty: question.difficulty,
    isPremium: question.isPremium,
    isLocked: false,
    answer: question.answer,
  };
};

module.exports = {
  getAllQuestions,
  getQuestionById,
};
