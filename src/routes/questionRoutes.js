const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const questionController = require('../controllers/questionController');

/**
 * @swagger
 * /questions:
 *   get:
 *     summary: Get all questions
 *     description: Returns all questions with isLocked field based on user's current plan
 *     tags: [Questions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       difficulty:
 *                         type: string
 *                         enum: [easy, medium, hard]
 *                       isPremium:
 *                         type: boolean
 *                       isLocked:
 *                         type: boolean
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, questionController.getAllQuestions);

/**
 * @swagger
 * /questions/{id}:
 *   get:
 *     summary: Get a question by ID
 *     description: Returns question details. Answer is only included if user's plan allows access.
 *     tags: [Questions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The question ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Question with answer (if access granted)
 *       403:
 *         description: Access restricted - upgrade plan required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Upgrade your plan to access this content"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Question not found
 */
router.get('/:id', authenticate, questionController.getQuestionById);

module.exports = router;
