import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDEKi9U8mt2Z8w0n3OrPKBFVxJwvzGXpcI",
  authDomain: "tchoukball-462b5.firebaseapp.com",
  projectId: "tchoukball-462b5",
  storageBucket: "tchoukball-462b5.appspot.com",
  messagingSenderId: "630695302210",
  appId: "1:630695302210:web:890d058be4bffd220c09db"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };