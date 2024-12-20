// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "saovet-hospital.firebaseapp.com",
  projectId: "saovet-hospital",
  storageBucket: "saovet-hospital.appspot.com",
  messagingSenderId: "625975629686",
  appId: "1:625975629686:web:8dd7cf5dc9a36230d5cc57",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
