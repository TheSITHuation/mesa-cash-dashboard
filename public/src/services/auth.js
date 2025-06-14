// public/src/services/auth.js
// 1️⃣ Importa directamente desde el CDN de Firebase ESM
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';
import {
  getAuth,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

// 2️⃣ Configuración (igual que antes)
const firebaseConfig = {
      apiKey: "AIzaSyAtX_lsgN49FPvXwyOslKdFOIjwJDzqqKk",
      authDomain: "poker-room-2.firebaseapp.com",
      projectId: "poker-room-2",
      storageBucket: "poker-room-2.firebasestorage.app",
      messagingSenderId: "222798291312",
      appId: "1:222798291312:web:88d22239cbd43e7b26efb5"
    };

// 3️⃣ Inicializa
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// 4️⃣ Exporta tus funciones aprovechando las ESM del CDN
function onAuthStateChanged(callback) {
  return firebaseOnAuthStateChanged(auth, async (user) => {
    if (user) {
      const tokenResult = await user.getIdTokenResult();
      user.role = tokenResult.claims.role || 'player';
    }
    callback(user);
  });
}
async function login(email, pass) {
  return (await signInWithEmailAndPassword(auth, email, pass)).user;
}
function logout() {
  return signOut(auth);
}
function getCurrentRole(user) {
  return user?.role || 'player';
}

export { auth, db, onAuthStateChanged, login, logout, getCurrentRole };
