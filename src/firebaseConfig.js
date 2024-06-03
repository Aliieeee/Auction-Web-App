// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3tMgaAk6U7qBfVHp6qrOrTGAKImPcwnM",
  authDomain: "auction-site-74fd5.firebaseapp.com",
  projectId: "auction-site-74fd5",
  storageBucket: "auction-site-74fd5.appspot.com",
  messagingSenderId: "1032945886949",
  appId: "1:1032945886949:web:074e7156a3e2722c1e960c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);



export { db, storage, auth };
