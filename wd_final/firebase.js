// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfvvFOr7UBU1OkGCZGswena13wWlXHwSk",
  authDomain: "web-dev-final-42f2a.firebaseapp.com",
  projectId: "web-dev-final-42f2a",
  storageBucket: "web-dev-final-42f2a.firebasestorage.app",
  messagingSenderId: "982726061429",
  appId: "1:982726061429:web:4bc100387db00c69dbf73c",
  measurementId: "G-438QLZT3PF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };
