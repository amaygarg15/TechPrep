import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyACE4ehHXBUIfOwkYAyF1p8bsrX4Bjw6pA",
  authDomain: "techprep-ddc41.firebaseapp.com",
  projectId: "techprep-ddc41",
  storageBucket: "techprep-ddc41.firebasestorage.app",
  messagingSenderId: "203956087507",
  appId: "1:203956087507:web:5d49952ad244da35ddc226"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
