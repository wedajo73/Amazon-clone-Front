import firebase from "firebase/compat/app"; // Default import for Firebase compat mode
import { getAuth } from "firebase/auth"; // Import Firebase v9 auth
import "firebase/compat/firestore"; // Import Firestore compat
import "firebase/compat/auth"; // Import Auth compat

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDHk2Xp-ExAy1jAq-l13H3YlgN7ZrwWBw",
  authDomain: "clone-f7bfb.firebaseapp.com",
  projectId: "clone-f7bfb",
  storageBucket: "clone-f7bfb.appspot.com",
  messagingSenderId: "715794757133",
  appId: "1:715794757133:web:bce7e844a363ab8ec28744",
  measurementId: "G-3ZPNV15BRT",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig); 
// Use compat mode to initialize Firebase
export const auth = getAuth(app); // Firebase v9 API
export const db = firebase.firestore(); // Use compat mode Firestore
