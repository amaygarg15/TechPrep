const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const planController = require('../controllers/planController');

/**
 * @swagger
 * /select-plan:
 *   post:
 *     summary: Select or upgrade user plan (mock payment)
 *     tags: [Plan]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plan
 *             properties:
 *               plan:
 *                 type: string
 *                 enum: [pro, premium]
 *                 description: The plan to upgrade to
 *             example:
 *               plan: pro
 *     responses:
 *       200:
 *         description: Plan upgraded successfully
 *       400:
 *         description: Invalid plan or already on the same plan
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, planController.selectPlan);

module.exports = router;
