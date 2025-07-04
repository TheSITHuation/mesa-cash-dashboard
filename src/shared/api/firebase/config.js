import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
      apiKey: "AIzaSyAtX_lsgN49FPvXwyOslKdFOIjwJDzqqKk",
      authDomain: "poker-room-2.firebaseapp.com",
      projectId: "poker-room-2",
      storageBucket: "poker-room-2.firebasestorage.app",
      messagingSenderId: "222798291312",
      appId: "1:222798291312:web:88d22239cbd43e7b26efb5"
    };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);