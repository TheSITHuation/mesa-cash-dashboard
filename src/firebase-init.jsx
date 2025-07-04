// /src/firebase-init.js


//    ¡¡ASEGÚRATE DE PONER AQUÍ TUS CREDENCIALES REALES!!
const firebaseConfig = {
      apiKey: "AIzaSyAtX_lsgN49FPvXwyOslKdFOIjwJDzqqKk",
      authDomain: "poker-room-2.firebaseapp.com",
      projectId: "poker-room-2",
      storageBucket: "poker-room-2.firebasestorage.app",
      messagingSenderId: "222798291312",
      appId: "1:222798291312:web:88d22239cbd43e7b26efb5"
    };

// 2. Inicializamos Firebase.
firebase.initializeApp(firebaseConfig);
console.log("Firebase App inicializada correctamente.");


// 3. Obtenemos y exportamos los servicios que necesitamos para otros módulos.
const db = firebase.firestore();
let auth = null; // Inicializamos auth como null por defecto.

// --- INICIO DE LA CORRECCIÓN ---
// Verificamos si el servicio de autenticación fue cargado en la página
// antes de intentar inicializarlo. La página 'display.html' no lo necesita.
if (typeof firebase.auth === 'function') {
    auth = firebase.auth();
}
// --- FIN DE LA CORRECCIÓN ---

export { db, auth };
