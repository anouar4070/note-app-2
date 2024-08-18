
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.REACT_APP_API_KEY,
  authDomain: "react-notes-74ae9.firebaseapp.com",
  projectId: "react-notes-74ae9",
  storageBucket: "react-notes-74ae9.appspot.com",
  messagingSenderId: "880172673902",
  appId: import.meta.env.REACT_APP_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
export const notesCollection = collection(db, "notes")