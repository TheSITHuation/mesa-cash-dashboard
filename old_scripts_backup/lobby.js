// public/assets/js/lobby.js

// ================================================
// 1️⃣ IMPORTS y AUTENTICACIÓN ANÓNIMA (si aplica)
// ================================================
import { onAuthStateChanged, auth } from '../../../src/services/auth.js';
import { signInAnonymously } from 'firebase/auth';

// Opcional: autenticar usuarios de lobby de forma anónima
// Descomenta la siguiente línea si quieres que todos los jugadores se autentiquen anónimamente:
// signInAnonymously(auth);

// ================================================
// 2️⃣ CALLBACK que garantiza que Auth está listo
// ================================================
onAuthStateChanged(user => {
  if (!user) {
    // Si no hay user (falló anónima), podrías reintentar o mostrar mensaje
    console.warn('No se pudo establecer sesión de usuario para lobby');
    return;
  }
  // Inicia la aplicación de lobby una vez Auth está preparado
  initLobbyApp();
});

// ================================================
// 3️⃣ Función que inicializa la aplicación de lobby
// ================================================
function initLobbyApp() {
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Lobby.js: Iniciando vista de jugador...');
// Espera a que el DOM esté completamente cargado

    // =================================================================================
    // CONFIGURACIÓN DE FIREBASE
    // =================================================================================
    // PEGA AQUÍ TU CÓDIGO DE FIREBASECONFIG. DEBE SER EL MISMO QUE USASTE EN APP.JS.
    const firebaseConfig = {
          apiKey: "AIzaSyAtX_lsgN49FPvXwyOslKdFOIjwJDzqqKk",
          authDomain: "poker-room-2.firebaseapp.com",
          projectId: "poker-room-2",
          storageBucket: "poker-room-2.firebasestorage.app",
          messagingSenderId: "222798291312",
          appId: "1:222798291312:web:88d22239cbd43e7b26efb5"
    };
    // =================================================================================

    // Inicialización de Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const mesasCollection = db.collection("mesas");

    // --- CONFIGURACIÓN DEL LOBBY ---
    // ¡IMPORTANTE! Reemplaza este número con el número de WhatsApp de la sala.
    const WHATSAPP_NUMBER = '529931758870'; // <<-- REEMPLAZAR ESTE NÚMERO

    // --- FUNCIONES DE RENDERIZADO ---

    function getTableStatusInfo(record) {
        const totalSeats = 9;
        if (!record || record.tableStatus === 'inactivo') {
            return { text: 'Inactiva', className: 'status-inactive' };
        }
        if (record.tableStatus === 'pausa') {
            return { text: 'En Pausa', className: 'status-inactive' };
        }
        if (record.playerCount >= totalSeats) {
            return { text: 'Llena', className: 'status-full' };
        }
        if (record.playerCount >= totalSeats - 2) {
            return { text: 'Casi Llena', className: 'status-almost-full' };
        }
        return { text: 'Activa', className: 'status-active' };
    }

    function escapeHTML(str) {
        return String(str || '').replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[m]));
    }
        // Convierte segundos en "HH:MM:SS"
    function formatTime(seconds) {
        seconds = typeof seconds === 'number' && !isNaN(seconds) ? seconds : 0;
        const h = Math.floor(seconds / 3600),
              m = Math.floor((seconds % 3600) / 60),
              s = seconds % 60;
        return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }


    function createLobbyCardHTML(record) {
        if (!record) return '';

        const status = getTableStatusInfo(record);
        const playerCount = record.playerCount || 0;
        const waitlistCount = record.waitlistCount || 0;
        
        const message = encodeURIComponent(`Hola, quisiera anotarme en la lista de espera para la Mesa ${record.tableVisualNumber || ''} (Juego: ${record.gameType || 'N/A'}).`);
        const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

        return `
            <div class="lobby-card" data-table-id="${record.tableId}">
                <div class="card-header">
                    <h3>MESA ${escapeHTML(record.tableVisualNumber || 'N/A')}</h3>
                    <div class="table-status ${status.className}">
                        <span>${status.text}</span>
                    </div>
                </div>
                <div class="card-body">
                    <ul>
                        <li>
                          <i class="fa-solid fa-dice-d20"></i>
                          <span class="label">Juego:</span>
                          <span class="value">${escapeHTML(record.gameType || 'N/A')}</span>
                        </li>
                        <li>
                          <i class="fa-solid fa-coins"></i>
                          <span class="label">Ciegas:</span>
                          <span class="value">${escapeHTML(record.blinds || 'N/A')}</span>
                        </li>
+                       <li>
+                         <i class="fa-solid fa-money-bill-wave"></i>
+                         <span class="label">Buy-in:</span>
+                         <span class="value">${escapeHTML(record.buyinRange || 'N/A')}</span>
+                       </li>
                        <li>
                          <i class="fa-solid fa-users"></i>
                          <span class="label">Jugadores:</span>
                          <span class="value">${playerCount} / 9</span>
                        </li>
                        <li>
                          <i class="fa-solid fa-hourglass-half"></i>
                          <span class="label">Espera:</span>
                          <span class="value">${waitlistCount} personas</span>
                        </li>
+                       <li>
+                         <i class="fa-regular fa-clock"></i>
+                         <span class="label">Tiempo Mesa:</span>
+                         <span class="value">${formatTime(record.mainTimerSeconds)}</span>
+                       </li>
                    </ul>
                </div>
                <div class="card-footer">
                    <button class="card-button button-secondary view-players-btn" ${playerCount === 0 ? 'disabled' : ''}>
                        <i class="fa-solid fa-eye"></i> Ver Jugadores
                    </button>
                    <a href="${whatsappLink}" class="card-button button-primary" target="_blank">
                        <i class="fa-brands fa-whatsapp"></i> Anotarme
                    </a>
                </div>
            </div>
        `;
    }
    
    function addEventListenersToButtons() {
        document.querySelectorAll('.view-players-btn').forEach(button => {
            button.addEventListener('click', async function() {
                const tableId = this.closest('.lobby-card').dataset.tableId;
                const doc = await mesasCollection.doc(tableId).get();
                if(!doc.exists) return;
                const record = doc.data();
                
                if (record && record.playerCount > 0) {
                    let playersListHTML = '<ul class="swal-players-list">';
                    for (let i = 1; i <= 9; i++) {
                        const playerName = record[`seat_${i}_player`];
                        if (playerName) {
                            playersListHTML += `<li>${escapeHTML(playerName)}</li>`;
                        }
                    }
                    playersListHTML += '</ul>';
                    Swal.fire({
                        title: `Jugadores en Mesa ${record.tableVisualNumber}`,
                        html: playersListHTML,
                        confirmButtonText: 'Cerrar',
                        customClass: { popup: 'swal-wide' }
                    });
                } else {
                     Swal.fire('Mesa Vacía', 'Aún no hay jugadores en esta mesa.', 'info');
                }
            });
        });
    }

    // =================================================================================
    // PUNTO DE ENTRADA Y LISTENER EN TIEMPO REAL
    // =================================================================================
    
    function listenForLobbyUpdates() {
        const lobbyContainer = document.querySelector('.lobby-container');
        if (!lobbyContainer) {
            console.error("El contenedor del lobby no fue encontrado.");
            return;
        }
        lobbyContainer.innerHTML = '<p class="no-tables-message">Cargando mesas desde la base de datos...</p>';

        mesasCollection.onSnapshot(snapshot => {
            console.log("Lobby.js: Datos de mesas actualizados desde Firestore.");
            if (snapshot.empty) {
                lobbyContainer.innerHTML = '<p class="no-tables-message">No hay mesas activas en este momento. ¡Vuelve pronto!</p>';
                return;
            }
            
            let allCardsHTML = '';
            const tables = snapshot.docs.map(doc => doc.data()).sort((a, b) => (a.tableVisualNumber || 0) - (b.tableVisualNumber || 0));
            
            tables.forEach(record => {
                allCardsHTML += createLobbyCardHTML(record);
            });
            
            lobbyContainer.innerHTML = allCardsHTML;
            addEventListenersToButtons();

        }, error => {
            console.error("Error al escuchar actualizaciones del lobby:", error);
            if(error.code === 'resource-exhausted') {
                lobbyContainer.innerHTML = '<p class="no-tables-message" style="color:red;">Se ha excedido la cuota de uso de la base de datos por hoy.</p>';
            } else {
                lobbyContainer.innerHTML = '<p class="no-tables-message" style="color:red;">Error de conexión. No se pueden mostrar las mesas.</p>';
            }
        });
    }

    listenForLobbyUpdates();
});

}