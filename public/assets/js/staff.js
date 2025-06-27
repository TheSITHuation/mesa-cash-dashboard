// /assets/js/staff.js
// Este es el "Director de Orquesta". Coordina los demás módulos.

import { onAuthStateChanged, getCurrentRole, login, logout, ROLE_STAFF } from '/src/services/auth.js';
import { firestoreService } from '/src/services/firestoreService.js';
import { uiService } from '/src/services/uiService.js';

// Referencias al DOM
const loginContainer = document.getElementById('login-container');
const dashboard = document.getElementById('dashboard');
const loginBtn = document.getElementById('loginBtn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Estado Global de la Aplicación
let isAppInitialized = false;
const localTableState = {};
let seatingFromWaitlist = null;
const RAKE_INTERVAL_SECONDS = 1800;
let activeTableIdForModal = null;

// --- INICIO DE LA CORRECCIÓN ---
// Función centralizada y robusta para limpiar el estado de visualización del jugador.
// Se mueve aquí para que sea accesible globalmente dentro del módulo.
const clearPlayerViewingState = async (tableId) => {
    if (!tableId) return;

    const record = await firestoreService.getRecord(tableId);
    if (record?.uiState?.viewingPlayerName) {
        const newUiState = {
            isPanelOpen: record.uiState.isPanelOpen || false,
            viewingPlayerName: null,
            viewingPlayerSeat: null,
            viewingPlayerTime: null,
        };
        await firestoreService.updateField(tableId, 'uiState', newUiState);
    }
};
// --- FIN DE LA CORRECCIÓN ---


// --- Flujo de Autenticación y UI Principal ---

function showLoginUI() {
    loginContainer.style.display = 'block';
    dashboard.style.display = 'none';
}

function showDashboardUI() {
    loginContainer.style.display = 'none';
    dashboard.style.display = 'block';
}

onAuthStateChanged(async (user) => {
    if (user) {
        const role = await getCurrentRole(user);
        if (role === ROLE_STAFF) {
            showDashboardUI();
            initStaffApp();
        } else {
            await Swal.fire('Acceso Denegado', `No tienes permisos de 'staff'. Rol: ${role || 'ninguno'}.`, 'error');
            await logout();
        }
    } else {
        showLoginUI();
    }
});

loginBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const pass = passwordInput.value;
    if (!email || !pass) return Swal.fire('Campos vacíos', 'Por favor, introduce email y contraseña.', 'warning');
    try {
        await login(email, pass);
    } catch (error) {
        Swal.fire('Error de Acceso', 'Credenciales incorrectas.', 'error');
    }
});

// --- Inicialización y Lógica Principal ---

function initStaffApp() {
    if (isAppInitialized) return;
    isAppInitialized = true;
    
    uiService.init();

    document.getElementById('addTableButton').addEventListener('click', () => {
        const tableId = 'table-' + crypto.randomUUID();
        const tableCount = document.querySelectorAll('.table-section').length + 1;
        firestoreService.startNewSession(tableId, tableCount);
    });
    
    document.getElementById('player-card-close').addEventListener('click', () => {
        clearPlayerViewingState(activeTableIdForModal);
        activeTableIdForModal = null;
    });
    document.getElementById('player-card-modal-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'player-card-modal-overlay') {
            clearPlayerViewingState(activeTableIdForModal);
            activeTableIdForModal = null;
        }
    });

    firestoreService.onTablesSnapshot(snapshot => {
        snapshot.docChanges().forEach((change) => {
            const docId = change.doc.id;
            const docData = change.doc.data();
            const existingElement = document.querySelector(`[data-table-id="${docId}"]`);

            if (change.type === "added" && !existingElement) {
                requestAnimationFrame(() => {
  setTimeout(() => {
    const lastTable = document.querySelector(`[data-table-id="${docId}"]`);
    if (lastTable) {
      lastTable.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, 250);
});

                uiService.createTableElement(docId);
                addEventListenersForTable(docId);
                  requestAnimationFrame(() => {
    const el = document.querySelector(`[data-table-id="${docId}"]`);
    if (el) {
      el.classList.add('mesa-nueva');
      setTimeout(() => el.classList.remove('mesa-nueva'), 2000);
    }
  });
}
            
            
            if (change.type === "added" || change.type === "modified") {
                if (!localTableState[docId]) localTableState[docId] = { lastRakeCheck: 0 };
                uiService.updateTableUI(docId, docData, localTableState[docId]);

                if (docData.tableStatus === 'activo') {
                    const elapsed = docData.mainTimerStartTime?.toDate ? (Date.now() - docData.mainTimerStartTime.toDate().getTime()) / 1000 : 0;
                    const totalSeconds = (docData.mainTimerSeconds || 0) + elapsed;
                    const currentRakePeriod = Math.floor(totalSeconds / RAKE_INTERVAL_SECONDS);

                    if (currentRakePeriod > 0 && currentRakePeriod > localTableState[docId].lastRakeCheck) {
                        localTableState[docId].lastRakeCheck = currentRakePeriod;
                        uiService.showRakeBanner(docId);
                    }
                }
            } else if (change.type === "removed") {
                if (localTableState[docId]?.timerInterval) clearInterval(localTableState[docId].timerInterval);
                delete localTableState[docId];
                uiService.removeTableElement(docId);
            }
        });
        uiService.adjustLayoutForTables();
    });
}

// --- Manejadores de Eventos ---

function addEventListenersForTable(tableId) {
    const tableSection = document.querySelector(`[data-table-id="${tableId}"]`);
    if (!tableSection) return;

    const sidePanel = tableSection.querySelector('.side-panel');
    if (sidePanel) {
        sidePanel.addEventListener('mouseenter', () => {
            firestoreService.updateField(tableId, 'uiState.isPanelOpen', true);
        });
        sidePanel.addEventListener('mouseleave', () => {
            firestoreService.updateField(tableId, 'uiState.isPanelOpen', false);
        });
    }

    const statusControl = tableSection.querySelector('.status-control');
    if (statusControl) {
        statusControl.addEventListener('change', (e) => {
            if (e.target.type === 'radio') {
                firestoreService.updateTableStatus(tableId, e.target.value);
            }
        });
    }

    const editableFields = [
        { selector: '.value-mesa-display', key: 'tableVisualNumber' },
        { selector: '.value-juego-ontable', key: 'gameType' },
        { selector: '.value-blinds-ontable', key: 'blinds' },
        { selector: '.value-buyin-ontable', key: 'buyinRange' }
    ];
    editableFields.forEach(field => {
        const element = tableSection.querySelector(field.selector);
        if (element) {
            element.addEventListener('blur', () => {
                firestoreService.updateField(tableId, field.key, element.textContent.trim());
            });
        }
    });

    tableSection.addEventListener('click', async (e) => {
        const target = e.target;
        if (target.closest('.seat')) return handleSeatClick(target.closest('.seat'), tableId);
        
        if (target.closest('.show-on-screen-btn')) {
            const publicUrl = `/display.html?table=${tableId}`;
            window.open(publicUrl, `_blank_table_${tableId}`);
        }
        
        if (target.closest('.delete-table')) {
            const result = await Swal.fire({ title: '¿Eliminar mesa?', text: "Esta acción es irreversible.", icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, eliminar', confirmButtonColor: '#d33' });
            if (result.isConfirmed) firestoreService.deleteRecord(tableId);
        }
        if (target.closest('.add-waitlist-row')) {
            const { value: name } = await Swal.fire({ title: 'Añadir a Lista de Espera', input: 'text', inputPlaceholder: 'Nombre', showCancelButton: true, inputValidator: v => !v && 'El nombre es obligatorio' });
            if (name) {
                const record = await firestoreService.getRecord(tableId);
                const newList = [...(record.waitlistPlayers || []), name];
                firestoreService.updateWaitlist(tableId, newList);
            }
        }
        if (target.closest('.export-csv-button')) {
            Swal.fire('Función no implementada', 'La exportación a CSV aún no está conectada.', 'info');
        }
    });
    
    const waitlistBody = tableSection.querySelector('.waitlist-table tbody');
    if(waitlistBody) {
        waitlistBody.addEventListener('click', async (e) => {
            const target = e.target;
            const row = target.closest('tr');
            if (!row) return;
            const name = row.cells[0].textContent;
            const record = await firestoreService.getRecord(tableId);
            const list = record.waitlistPlayers || [];
            
            if (target.closest('.remove-player')) {
                const newList = list.filter(p => p !== name);
                firestoreService.updateWaitlist(tableId, newList);
            }
            if (target.closest('.seat-player')) {
                seatingFromWaitlist = name;
                tableSection.classList.add('seating-mode');
                Swal.fire({ title: `Sentando a ${name}`, text: 'Por favor, haz clic en un asiento vacío.', icon: 'info', timer: 3000, showConfirmButton: false });
            }
        });
    }
}

async function handleSeatClick(seat, tableId) {
    const seatNumber = seat.dataset.seat;

    if (seatNumber === "10") {
        const record = await firestoreService.getRecord(tableId);
        const newIndex = ((record?.dealerImageIndex || 0) + 1) % uiService.getDealerImagesCount();
        return firestoreService.changeDealer(tableId, newIndex);
    }
    
    if (seat.classList.contains('occupied')) {
        const playerName = seat.dataset.playerName;
        
        const result = await Swal.fire({
            title: `${seatNumber}: ${playerName}`,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: '<i class="fas fa-sign-out-alt"></i> Cash Out',
            denyButtonText: `<i class="fas fa-coins"></i> Buy-In`,
            cancelButtonText: 'Cancelar',
            footer: '<button id="view-player-card" class="swal2-confirm swal2-styled">Ver Ficha</button>',
            didOpen: () => {
                document.getElementById('view-player-card').addEventListener('click', async () => {
                    Swal.close(); 
                    const record = await firestoreService.getRecord(tableId);
                    const playerData = record?.players?.find(p => p.name === playerName && !p.leaveTime);
                    if(!playerData) return;
                    
                    let secondsToShow = record[`seat_${seat.dataset.seat}_seconds`] || 0;
                    if(record.tableStatus === 'activo' && record[`seat_${seat.dataset.seat}_startTime`]?.toDate){
                        secondsToShow += (Date.now() - record[`seat_${seat.dataset.seat}_startTime`].toDate().getTime()) / 1000;
                    }
                    
                    activeTableIdForModal = tableId;
                    const uiState = {
                        isPanelOpen: record.uiState?.isPanelOpen || false,
                        viewingPlayerName: playerName,
                        viewingPlayerSeat: seat.dataset.seat,
                        viewingPlayerTime: secondsToShow,
                    };
                    firestoreService.updateField(tableId, 'uiState', uiState);

                    uiService.showPlayerCard(playerData, { seconds: secondsToShow }, seat.querySelector('.seat-content').innerHTML);
                });
            }
        });
        
        if (result.isDismissed) {
            await clearPlayerViewingState(tableId);
        }

        if (result.isConfirmed) {
            await firestoreService.vacateSeat(tableId, seatNumber);
        } else if (result.isDenied) {
            const { value: amount } = await Swal.fire({ title: `Buy-In para ${playerName}`, input: 'number', inputLabel: 'Monto', showCancelButton: true, inputValidator: v => (!v || v <= 0) && 'Debe ser un número positivo' });
            if (amount) {
                await firestoreService.registerBuyIn(tableId, playerName, amount);
                Swal.fire('Compra Registrada', '', 'success');
            }
        }

    } else { 
        const prefillName = seatingFromWaitlist || "";
        seatingFromWaitlist = null;
        seat.closest('.table-section').classList.remove('seating-mode');

        const { value: result } = await Swal.fire({
            title: 'Ocupar Asiento',
            html: `<input id="swal-input-player" class="swal2-input" placeholder="Nombre" value="${prefillName}"><input id="swal-input-avatar" class="swal2-input" placeholder="Avatar (ej: Batman-90)">`,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => ({
                playerName: document.getElementById('swal-input-player').value.trim(),
                avatarName: document.getElementById('swal-input-avatar').value.trim() || null
            })
        });
        if (result?.playerName) {
            await firestoreService.occupySeat(tableId, seatNumber, result.playerName, result.avatarName);
            Swal.fire('Jugador Sentado', '', 'success');
        }
    }
}

// ✅ Fallback de inicialización sin duplicar funciones ni imports
// Coloca este bloque al final de staff.js (fuera de cualquier función)

// ⚠️ No vuelvas a importar getCurrentRole, ya está importado arriba
// Solo usamos lo que ya está en el archivo y disponible en scope global

if (typeof firebase !== 'undefined' && firebase.auth) {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(async () => {
      try {
        const user = firebase.auth().currentUser;
        if (user && !isAppInitialized) {
          const role = await getCurrentRole(user);
          if (role === ROLE_STAFF) {
            console.log('[Fallback Init] Reintentando inicialización como staff.');
            showDashboardUI();
            initStaffApp();
          }
        }
      } catch (err) {
        console.warn('Error en fallback de login automático:', err);
      }
    }, 500);
  });
}
