import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDc-SQxr-sfDSgwUUECJ-Q-Vms3JS9kEmE",
  authDomain: "rutu-sutra.firebaseapp.com",
  projectId: "rutu-sutra",
  storageBucket: "rutu-sutra.firebasestorage.app",
  messagingSenderId: "683180094105",
  appId: "1:683180094105:web:826d3dc0dca4d8b576be08",
  measurementId: "G-7LX2DRGEX4",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);