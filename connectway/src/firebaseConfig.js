// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"
import { getAuth, GoogleAuthProvider  } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDThW6hPSnfgd9zMKzd6J-V9z1flJ3ueHM",
  authDomain: "connectway-867ac.firebaseapp.com",
  projectId: "connectway-867ac",
  storageBucket: "connectway-867ac.appspot.com",
  messagingSenderId: "153441877372",
  appId: "1:153441877372:web:ea33be2770049b7bb8b8f9",
  measurementId: "G-5FJZHQL99V"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, app, storage,auth,googleProvider };
