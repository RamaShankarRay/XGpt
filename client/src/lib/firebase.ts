import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAfmNLjccT5uIMfbbJ1Kz79f4hO6JI2uk0",
  authDomain: "xgpt-711db.firebaseapp.com",
  databaseURL: "https://xgpt-711db-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "xgpt-711db",
  storageBucket: "xgpt-711db.firebasestorage.app",
  messagingSenderId: "1064119015897",
  appId: "1:1064119015897:web:8241955513247754c121c8",
  measurementId: "G-QHEPRE61M2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
