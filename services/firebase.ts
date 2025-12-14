import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCP4_-ANkpaKssNYFvnBarbNSPQ_aJF4oQ",
  authDomain: "projeto-aletheia.firebaseapp.com",
  projectId: "projeto-aletheia",
  storageBucket: "projeto-aletheia.firebasestorage.app",
  messagingSenderId: "692295731776",
  appId: "1:692295731776:web:2ba9929f9cf6a330efada5",
  measurementId: "G-W9NYYDVB6B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
