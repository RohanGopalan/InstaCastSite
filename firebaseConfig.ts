import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArCuBfGYVl3pqO_g3O8YOHlugmZO-BZVE",
  authDomain: "instacast-bec3a.firebaseapp.com",
  projectId: "instacast-bec3a",
  storageBucket: "instacast-bec3a.appspot.com", // FIXED storageBucket domain
  messagingSenderId: "546008925809",
  appId: "1:546008925809:web:91250cd45eae54bafcbdd0",
  measurementId: "G-38GY1XVVZS",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Prevent running Analytics in SSR mode
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(firebaseApp);
}

export { firebaseApp, analytics };