
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAQ3K0OWszkfLKILA4Bo6XA4By8Svk3I5U",
  authDomain: "anime-connect-ef3df.firebaseapp.com",
  databaseURL: "https://anime-connect-ef3df-default-rtdb.firebaseio.com",
  projectId: "anime-connect-ef3df",
  storageBucket: "anime-connect-ef3df.firebasestorage.app",
  messagingSenderId: "215484079123",
  appId: "1:215484079123:web:c6ab36ce7c72359448b3e6",
  measurementId: "G-NTRD6QNKRR"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
