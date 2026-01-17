// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBw8iem0vilnpkVz8Jy0km5BysotXMEqBk",
  authDomain: "diledrop-70f59.firebaseapp.com",
  projectId: "diledrop-70f59",
  storageBucket: "diledrop-70f59.firebasestorage.app",
  messagingSenderId: "941934127479",
  appId: "1:941934127479:web:8a35baa1fab9d5017a5972"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
