// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2-5LWSg7CD0d9zLXEZQC4nzHgW4GwcNY",
  authDomain: "household-app-ced84.firebaseapp.com",
  projectId: "household-app-ced84",
  storageBucket: "household-app-ced84.firebasestorage.app",
  messagingSenderId: "54338211714",
  appId: "1:54338211714:web:92970842314a63a296899b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
