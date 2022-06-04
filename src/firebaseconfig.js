import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDefTpS1cYz8CzdxbV_mYH-y6LhaZWGUzk",
  authDomain: "firecart-c7b8b.firebaseapp.com",
  projectId: "firecart-c7b8b",
  storageBucket: "firecart-c7b8b.appspot.com",
  messagingSenderId: "216622840532",
  appId: "1:216622840532:web:58f919f70a04a63d57d941",
  measurementId: "G-1CR3TRHN35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app, "gs://firecart-c7b8b.appspot.com");

export { app, auth, db, storage };