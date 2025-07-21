// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcMprAtvahDzoSrqprsfz8uNYfsnmLa-Q",
  authDomain: "ecommerceapp-b1a2d.firebaseapp.com",
  databaseURL: "https://ecommerceapp-b1a2d-default-rtdb.firebaseio.com",
  projectId: "ecommerceapp-b1a2d",
  storageBucket: "ecommerceapp-b1a2d.firebasestorage.app",
  messagingSenderId: "559343171370",
  appId: "1:559343171370:web:a198d0e61c8d1b3ca55053",
  measurementId: "G-LV07W7X8EQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Initialize providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export default app;