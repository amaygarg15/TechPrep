const admin = require('firebase-admin');
const path = require('path');

const initializeFirebase = () => {
  try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

    if (!serviceAccountPath) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_PATH environment variable is not set');
    }

    const serviceAccount = require(path.resolve(serviceAccountPath));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log('Firebase Admin SDK initialized');
  } catch (error) {
    console.error(`Firebase initialization error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { admin, initializeFirebase };
