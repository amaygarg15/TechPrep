import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Using environment variables to prevent automated GitHub/GCP security scanners 
// from incorrectly flagging the public Firebase Web API key as a sensitive secret.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "techprep-ddc41.firebaseapp.com",
  projectId: "techprep-ddc41",
  storageBucket: "techprep-ddc41.firebasestorage.app",
  messagingSenderId: "203956087507",
  appId: "1:203956087507:web:5d49952ad244da35ddc226"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
