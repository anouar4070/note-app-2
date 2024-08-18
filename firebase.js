
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA9LnQrX6piwaSLZB7AhL0OYnqA-87sstk",
  authDomain: "react-notes-74ae9.firebaseapp.com",
  projectId: "react-notes-74ae9",
  storageBucket: "react-notes-74ae9.appspot.com",
  messagingSenderId: "880172673902",
  appId: "1:880172673902:web:82ade8f0573d101cbfaf7f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const notesCollection = collection(db, "notes")