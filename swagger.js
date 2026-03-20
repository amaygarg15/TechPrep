const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TechPrep API',
      version: '1.0.0',
      description:
        'Backend API for the TechPrep platform — a tech interview preparation service with plan-based access control and Firebase authentication.',
      contact: {
        name: 'TechPrep API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'Firebase ID Token',
          description:
            'Enter your Firebase ID token. Get one by signing in via the Firebase Auth REST API.',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            firebase_uid: { type: 'string' },
            email: { type: 'string' },
            plan: { type: 'string', enum: ['free', 'pro', 'premium'] },
            plan_activated_at: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Question: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
            isPremium: { type: 'boolean' },
            isLocked: { type: 'boolean' },
          },
        },
        QuestionWithAnswer: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
            isPremium: { type: 'boolean' },
            isLocked: { type: 'boolean' },
            answer: { type: 'string' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication & user profile' },
      { name: 'Plan', description: 'Plan selection and mock payment' },
      { name: 'Questions', description: 'Questions and answers with access control' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
