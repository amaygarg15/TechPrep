const dotenv = require('dotenv');

// Load environment variables FIRST
dotenv.config();

const app = require('./src/app');
const connectDB = require('./src/config/db');
const { initializeFirebase } = require('./src/config/firebase');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Initialize Firebase Admin SDK
    initializeFirebase();

    // 3. Start Express server
    app.listen(PORT, () => {
      console.log(`\nTechPrep API server running on port ${PORT}`);
      console.log(`API Docs: http://localhost:${PORT}/api-docs`);
      console.log(`Health:   http://localhost:${PORT}/health\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
