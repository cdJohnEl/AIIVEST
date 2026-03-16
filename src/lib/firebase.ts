// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDikLIiwR74BK-mGJyNpGXvZP4B9ZfmqDA",
  authDomain: "catalyst-5a307.firebaseapp.com",
  projectId: "catalyst-5a307",
  storageBucket: "catalyst-5a307.firebasestorage.app",
  messagingSenderId: "696348164749",
  appId: "1:696348164749:web:4537de6553ec121384d8c4",
  measurementId: "G-7YYVHR0XXE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
