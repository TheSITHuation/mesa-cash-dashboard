// public/assets/js/staff.js

// ================================================
// 1️⃣ IMPORTS y GUARD de autenticación
// ================================================
import {
  onAuthStateChanged,
  getCurrentRole,
  logout
} from '../../../src/services/auth.js';

// 1) Ocultamos el login o el dashboard según el estado
function showLogin() {
  document.getElementById('login-container').style.display = 'block';
}
function showDashboard() {
  document.getElementById('login-container').style.display = 'none';
}

onAuthStateChanged(async (user) => {
  if (!user || getCurrentRole(user) !== 'staff') {
    showLogin();
    return;
  }
  showDashboard();
  initStaffApp();
});

// 2) Handler del botón de login
document.getElementById('loginBtn').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const pass  = document.getElementById('password').value;
  try {
    await login(email, pass);
    // onAuthStateChanged se encargará de arrancar el dashboard
  } catch (e) {
    document.getElementById('loginError').textContent = e.message;
  }
});

// ================================================
// 2️⃣ CALLBACK que valida sesión y rol
// ================================================
// public/assets/js/staff.js (parte superior, donde tienes onAuthStateChanged)
onAuthStateChanged(user => {
  console.log('🔐 onAuthStateChanged ➞ user =', user);
  if (!user || getCurrentRole(user) !== 'staff') {
    console.warn('❌ No eres staff, redirigiendo...')
    window.location.replace('/index.html');
    return;
  }
  initStaffApp();
});


// ================================================
// 3️⃣ Function que inicializa la aplicación de staff
// ================================================
function initStaffApp() {
  // Espera a que el DOM esté listo
  document.addEventListener('DOMContentLoaded', function() {
    console.log("App.js: Iniciando aplicación...");

    // =================================================================================
    // CONFIGURACIÓN E INICIALIZACIÓN DE FIREBASE
    // =================================================================================
    const firebaseConfig = {
        apiKey: "AIzaSyAtX_lsgN49FPvXwyOslKdFOIjwJDzqqKk", // Buenas prácticas: usar variables de entorno
        authDomain: "poker-room-2.firebaseapp.com",
        projectId: "poker-room-2",
        storageBucket: "poker-room-2.appspot.com",
        messagingSenderId: "222798291312",
        appId: "1:222798291312:web:88d22239cbd43e7b26efb5"
    };

    // --- INICIALIZACIÓN DE FIREBASE ---
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();
    const mesasCollection = db.collection("mesas");
    const { increment, serverTimestamp } = firebase.firestore.FieldValue;

    
    const loginContainer  = document.getElementById('login-container');
const dashboard       = document.getElementById('dashboard');
const emailInput      = document.getElementById('email');
const passInput       = document.getElementById('password');
const loginBtn        = document.getElementById('loginBtn');
const loginError      = document.getElementById('loginError');


    // =================================================================================
    // CONSTANTES Y VARIABLES GLOBALES
    // =================================================================================
    const STATUS_ACTIVE = 'activo', STATUS_PAUSED = 'pausa', STATUS_INACTIVE = 'inactivo';
    const RAKE_INTERVAL_SECONDS = 1800; // 30 minutos
    const emojiIcons = ['😎','🤥','🥸','😀','🤑','😉','😡','🤠','🤩','🤔','😴','😏','🤯','🥶','👽','💩','🥷🏻'];
    const dealerImages = [ 
        "https://i.postimg.cc/Cxy2YZC6/crupier-1.png", "https://i.postimg.cc/cLQbJsX1/crupier.png",
        "https://i.postimg.cc/L85YfvRK/1.png", "https://i.postimg.cc/xdbXpCc6/2.png",
        "https://i.postimg.cc/NMq53cXB/3.png", "https://i.postimg.cc/QtQHsyg5/4.png",
        "https://i.postimg.cc/MHzXGmtL/5.png", "https://i.postimg.cc/DmkrJBPr/Maria-Alvarado.png",
];
    const playerImagesByName = [ 
{ name: "Alice", url: "https://i.postimg.cc/MH2WnHQD/Alice.png"}, { name: "Art", url: "https://i.postimg.cc/xCkCkBF0/Art.png"},
{ name: "Ayra", url: "https://i.postimg.cc/QCQj1Dgr/Ayra.png"}, { name: "Barbie", url: "https://i.postimg.cc/gc8zfVCB/Barbie.png"},
{ name: "Batman-90", url: "https://i.postimg.cc/3JZKwKJX/Batman-90.png"}, { name: "Bender", url: "https://i.postimg.cc/pXvWx9xV/Bender.png"},
{ name: "Bugs", url: "https://i.postimg.cc/rwFq0vKv/Bugs-Bunny.png"}, { name: "CH", url: "https://i.postimg.cc/sg6spwW1/CH.png"},
{ name: "GOT", url: "https://i.postimg.cc/ZqWZjpPH/Dhaeris.png"}, { name: "100Dlls", url: "https://i.postimg.cc/tg8bcJ2j/Franklin.png"},
{ name: "Freddy", url: "https://i.postimg.cc/4yVxPVgq/freddy-krueger.png"}, { name: "Gandalf", url: "https://i.postimg.cc/FRcvXvBJ/Gandalf.png"},
{ name: "A52p2", url: "https://i.postimg.cc/pTgdKkgK/GFKnife.png"}, { name: "A52p", url: "https://i.postimg.cc/05wj9Rwn/Ghostface2.png"},
{ name: "Gollum", url: "https://i.postimg.cc/sxrrVLkH/Gollum.png"}, { name: "Goofy", url: "https://i.postimg.cc/QCJrVbs8/Goofy.png"},
{ name: "Itachi", url: "https://i.postimg.cc/66rKH9Zk/Itachi.png"}, { name: "Jason", url: "https://i.postimg.cc/3JjwDX9D/Jason-hoorvees.png"},
{ name: "JW", url: "https://i.postimg.cc/VLP66G98/Jhon-Wick.png"}, { name: "Joker", url: "https://i.postimg.cc/tC9jwLtY/Joker.png"},
{ name: "Justice", url: "https://i.postimg.cc/WbSvvXXS/Justice.png"}, { name: "Liberty", url: "https://i.postimg.cc/g2JPk87p/Liberty.png"},
{ name: "Madara", url: "https://i.postimg.cc/Jz1z3sdY/Madara.png"}, { name: "Merlina", url: "https://i.postimg.cc/0NKR7xxH/Merlina.png"},
{ name: "Mona-Lisa", url: "https://i.postimg.cc/fRrQ3k49/Mona-Lisa.png"}, { name: "Neo", url: "https://i.postimg.cc/x1tT69wf/Neo.png"},
{ name: "Predator", url: "https://i.postimg.cc/xCrrR71j/Predator.png"}, { name: "Rambo", url: "https://i.postimg.cc/V6XxHRJq/Rambo.png"},
{ name: "Rick-S", url: "https://i.postimg.cc/L5Trm8Bh/Rick-S.png"}, { name: "Rogger", url: "https://i.postimg.cc/NFY3hHXW/Rogger.png"},
{ name: "Scooby", url: "https://i.postimg.cc/bNy731pn/Scooby.png"}, { name: "Serena", url: "https://i.postimg.cc/CMsyGcTY/Serena.png"},
{ name: "Skeletor", url: "https://i.postimg.cc/nLrV56xv/skeletor.png"}, { name: "Trooper", url: "https://i.postimg.cc/15vLT43j/Stormtrooper.png"},
{ name: "Titan-A", url: "https://i.postimg.cc/Vk53c1SL/Titan-A.png"}, { name: "Trump-J", url: "https://i.postimg.cc/dVXgsXdR/Trump-J.png"},
{ name: "WDCI", url: "https://i.postimg.cc/tgcRH2R8/WCDI.png"}, { name: "WW", url: "https://i.postimg.cc/C1fhMkz5/William-Wallace.png"},
{ name: "Yamcha", url: "https://i.postimg.cc/5tCT63qh/Yamcha.png"},  
 ];
    let currentEmojiIndex = 0;
    let seatingFromWaitlist = null;
    const localTableState = {};

    const mainContainer = document.getElementById('mainContainer');
    const addTableButton = document.getElementById('addTableButton');
    let playerInfoCardElement, playerInfoCardAvatarContainer, playerInfoCardNameElement, playerInfoCardTimeElement, playerInfoCardNumBuyinsElement, playerInfoCardTotalBuyinsElement;

    // =================================================================================
    // FUNCIONES AUXILIARES (CRUD en Firestore, formateo, etc.)
    // =================================================================================
    async function saveRecord(tableId, record) { try { await mesasCollection.doc(tableId).set(record, { merge: true }); } catch (e) { console.error("Error guardando registro:", e); } }
    async function getRecord(tableId) { try { const doc = await mesasCollection.doc(tableId).get(); return doc.exists ? doc.data() : null; } catch (e) { console.error("Error obteniendo registro:", e); return null; } }
    async function deleteRecord(tableId) { try { await mesasCollection.doc(tableId).delete(); } catch (e) { console.error("Error eliminando registro:", e); } }
    async function updatePlayerCount(tableId, amount) { try { await mesasCollection.doc(tableId).update({ playerCount: increment(amount) }); } catch (e) { console.error("Error actualizando contador de jugadores:", e); } }

    function formatTime(seconds) {
        seconds = typeof seconds === 'number' && !isNaN(seconds) ? seconds : 0;
        const h = Math.floor(seconds / 3600), m = Math.floor((seconds % 3600) / 60), s = Math.floor(seconds % 60);
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    function generateTableId() {
        return 'table-' + (crypto.randomUUID ? crypto.randomUUID() : Date.now() + Math.random().toString(36).substr(2, 9));
    }

    function escapeHTML(str) {
        return String(str || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
    }


    // =================================================================================
    // LÓGICA PRINCIPAL: iniciar sesión de mesa, ocupar/vaciar asiento, registrar buy-in, exportar CSV...
    // =================================================================================
    async function startSession(tableId) {
        const record = {
            tableId,
            creationTime: serverTimestamp(),
            players: [],
            buyIns: [],
            mainTimerSeconds: 0,
            mainTimerStartTime: null,
            marqueeText: "✨ Skampa Poker Room Anuncios! ✨",
            tableVisualNumber: String(document.querySelectorAll('.table-section').length + 1),
            gameType: 'NLHE',
            blinds: '25 / 25',
            buyinRange: '$1,000 - $5,000',
            tableStatus: STATUS_INACTIVE,
            dealerImageIndex: 0,
            playerCount: 0,
            waitlistCount: 0,
            waitlistPlayers: []
        };
        for (let i = 1; i <= 9; i++) {
            record[`seat_${i}_player`] = null;
            record[`seat_${i}_avatar`] = null;
            record[`seat_${i}_seconds`] = 0;
            record[`seat_${i}_startTime`] = null;
        }
        await saveRecord(tableId, record);
    }

    async function occupySeat(playerName, avatarName, tableId, seatNumber) {
        let avatarDisplayValue;
        const imgData = playerImagesByName.find(i => i.name.toLowerCase() === (avatarName || '').toLowerCase());
        avatarDisplayValue = imgData ? imgData.name : emojiIcons[currentEmojiIndex++ % emojiIcons.length];

        const record = await getRecord(tableId);
        const updateData = {
            [`seat_${seatNumber}_player`]: playerName,
            [`seat_${seatNumber}_avatar`]: avatarDisplayValue,
            [`seat_${seatNumber}_seconds`]: 0,
            [`seat_${seatNumber}_startTime`]: (record && record.tableStatus === STATUS_ACTIVE) ? serverTimestamp() : null
        };

        await saveRecord(tableId, updateData);
        await registerPlayer(playerName, tableId);
        await updatePlayerCount(tableId, 1);
    }

    async function vacateSeat(playerName, seatNumber, tableId) {
        const record = await getRecord(tableId);
        if (!record) return;

        const updateData = {
            [`seat_${seatNumber}_player`]: null,
            [`seat_${seatNumber}_avatar`]: null,
            [`seat_${seatNumber}_startTime`]: null
        };

        const seatStartTime = record[`seat_${seatNumber}_startTime`];
        let finalSeconds = record[`seat_${seatNumber}_seconds`] || 0;

        if (record.tableStatus === STATUS_ACTIVE && seatStartTime && seatStartTime.toDate) {
            const elapsed = (Date.now() - seatStartTime.toDate().getTime()) / 1000;
            finalSeconds += elapsed;
        }
        updateData[`seat_${seatNumber}_seconds`] = finalSeconds;

        await saveRecord(tableId, updateData);
        if (playerName) await registerCashOut(playerName, tableId);
        await updatePlayerCount(tableId, -1);
    }

    async function registerPlayer(playerName, tableId) {
        const record = await getRecord(tableId);
        if (record) {
            const players = record.players || [];
            if (!players.find(p => p.name === playerName && !p.leaveTime)) {
                players.push({ name: playerName, joinTime: new Date().toISOString(), leaveTime: null, buyIns: [] });
                await saveRecord(tableId, { players });
            }
        }
    }

    async function registerCashOut(playerName, tableId) {
        const record = await getRecord(tableId);
        if (record && record.players) {
            const updatedPlayers = record.players.map(p => {
                if (p.name === playerName && !p.leaveTime) return { ...p, leaveTime: new Date().toISOString() };
                return p;
            });
            await saveRecord(tableId, { players: updatedPlayers });
        }
    }

    async function registerBuyIn(playerName, amount, tableId) {
        const record = await getRecord(tableId);
        if (record) {
            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount) || parsedAmount <= 0) return;

            const buyInRec = { player: playerName, amount: parsedAmount, time: new Date().toISOString() };
            const buyIns = [...(record.buyIns || []), buyInRec];
            const players = (record.players || []).map(p => {
                if (p.name === playerName && !p.leaveTime) {
                    const playerBuyIns = [...(p.buyIns || []), { amount: parsedAmount, time: buyInRec.time }];
                    return { ...p, buyIns: playerBuyIns };
                }
                return p;
            });
            await saveRecord(tableId, { buyIns, players });
        }
    }
    
    async function exportTableDataToCSV(tableId) {
        const record = await getRecord(tableId);
        if (!record || !record.players || record.players.length === 0) {
            Swal.fire("Sin Datos", "No hay datos de jugadores para exportar en esta mesa.", "info");
            return;
        }

        const headers = ["Nombre", "Buy-in Total ($)", "N° de Compras", "Tiempo Jugado (HH:MM:SS)", "Hora de Entrada", "Hora de Salida"];
        let csvContent = headers.join(",") + "\n";

        record.players.forEach(player => {
            const totalBuyin = player.buyIns?.reduce((sum, buyIn) => sum + (parseFloat(buyIn.amount) || 0), 0) || 0;
            const numBuyins = player.buyIns?.length || 0;
            
            const joinTime = player.joinTime ? new Date(player.joinTime) : null;
            const leaveTime = player.leaveTime ? new Date(player.leaveTime) : new Date();

            let durationSeconds = 0;
            if(joinTime) {
                durationSeconds = (leaveTime.getTime() - joinTime.getTime()) / 1000;
            }

            const row = [
                player.name,
                totalBuyin,
                numBuyins,
                formatTime(durationSeconds),
                joinTime ? joinTime.toLocaleString() : "N/A",
                player.leaveTime ? leaveTime.toLocaleString() : "Jugando"
            ];
            
            const escapedRow = row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(",");
            csvContent += escapedRow + "\n";
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            const tableNumber = record.tableVisualNumber || tableId.substring(6, 10);
            link.setAttribute("href", url);
            link.setAttribute("download", `reporte_mesa_${tableNumber}_${new Date().toLocaleDateString()}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
    // =================================================================================
    // UI y eventos: creación de secciones de mesa, listeners de clicks, actualización de UI...
    // =================================================================================
        function adjustLayoutForTables() {
        const tables = mainContainer.querySelectorAll('.table-section');
        tables.forEach(t => t.classList.toggle('single-table-mode', tables.length === 1));
    }

    function initializePlayerInfoCardElements() {
        playerInfoCardElement = document.getElementById('playerInfoCard');
        if (playerInfoCardElement) {
            playerInfoCardAvatarContainer = playerInfoCardElement.querySelector('.player-info-card-avatar');
            playerInfoCardNameElement = playerInfoCardElement.querySelector('.player-info-card-name');
            playerInfoCardTimeElement = playerInfoCardElement.querySelector('.info-card-time');
            playerInfoCardNumBuyinsElement = playerInfoCardElement.querySelector('.info-card-num-buyins');
            playerInfoCardTotalBuyinsElement = playerInfoCardElement.querySelector('.info-card-total-buyins');
        } else console.error("Ficha técnica #playerInfoCard no encontrada.");
    }

    async function handleSeatClick(seat) {
        const tableSection = seat.closest('.table-section');
        const tableId = tableSection.dataset.tableId;

        if (seat.dataset.seat === "10") {
            const record = await getRecord(tableId);
            const newDealerIndex = ((record?.dealerImageIndex || 0) + 1) % dealerImages.length;
            await saveRecord(tableId, { dealerImageIndex: newDealerIndex });
            return;
        }

        if (!seat.classList.contains('occupied')) {
            const prefillName = seatingFromWaitlist || "";
            seatingFromWaitlist = null;
            tableSection.classList.remove('seating-mode');

            const result = await Swal.fire({
                title: 'Registro de jugador',
                html: `<input id="swal-input-player" class="swal2-input" placeholder="Nombre" value="${escapeHTML(prefillName)}"><input id="swal-input-avatar" class="swal2-input" placeholder="Avatar (opcional)">`,
                focusConfirm: false, showCancelButton: true, confirmButtonText: 'Registrar',
                preConfirm: () => {
                    const playerName = document.getElementById('swal-input-player').value.trim();
                    if (!playerName) { Swal.showValidationMessage('Por favor, ingrese un nombre.'); return false; }
                    return { playerName, avatarName: document.getElementById('swal-input-avatar').value.toLowerCase().trim() || null }
                }
            });
            if (result.isConfirmed && result.value) {
                await occupySeat(result.value.playerName, result.value.avatarName, tableId, seat.dataset.seat);
                Swal.fire({ title: "Jugador Sentado", text: `${result.value.playerName} está en el asiento ${seat.dataset.seat}.`, icon: "success", timer: 1500, showConfirmButton: false });
            }
        } else {
            const playerName = seat.dataset.playerName || "Jugador";
            const result = await Swal.fire({
                title: `Asiento ${seat.dataset.seat}: ${playerName}`, icon: 'question',
                showDenyButton: true, showCancelButton: true,
                confirmButtonText: 'Cash Out', denyButtonText: 'Buy-In'
            });
            if (result.isConfirmed) {
                await vacateSeat(playerName, seat.dataset.seat, tableId);
                Swal.fire({ title: "Asiento Liberado", text: `${playerName} ha dejado el asiento.`, icon: "info", timer: 1500, showConfirmButton: false });
            } else if (result.isDenied) {
                const { value: amount } = await Swal.fire({
                    title: `Buy-In para ${playerName}`, input: 'number',
                    inputLabel: 'Monto', showCancelButton: true,
                    inputValidator: v => (!v || parseFloat(v) <= 0) ? 'Monto inválido' : null
                });
                if (amount) {
                    await registerBuyIn(playerName, parseFloat(amount), tableId);
                    Swal.fire({ title: "Compra Registrada", text: `${playerName} compró ${parseFloat(amount).toLocaleString()}`, icon: "success", timer: 1500, showConfirmButton: false });
                }
            }
        }
    }

    function addEventListeners(tableSection, tableId) {
        tableSection.addEventListener('click', async (e) => {
            const target = e.target;
            const seat = target.closest('.seat');
            if (seat) { await handleSeatClick(seat); return; }

            if (target.closest('.delete-table')) {
                const result = await Swal.fire({ title: '¿Eliminar esta mesa?', text: "Esta acción es irreversible.", icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, eliminar', confirmButtonColor: '#d33' });
                if (result.isConfirmed) await deleteRecord(tableId);
                return;
            }
            if (target.closest('.side-panel-toggle-button')) {
                tableSection.classList.toggle('side-panel-collapsed');
                const icon = target.closest('.side-panel-toggle-button').querySelector('i');
                icon.className = `fas ${tableSection.classList.contains('side-panel-collapsed') ? 'fa-chevron-right' : 'fa-chevron-left'}`;
                return;
            }
            if (target.closest('.add-waitlist-row')) {
                const { value: playerName } = await Swal.fire({ title: 'Agregar a Lista de Espera', input: 'text', inputPlaceholder: 'Nombre del jugador', showCancelButton: true, inputValidator: v => !v && 'El nombre es obligatorio' });
                if (playerName) {
                    const record = await getRecord(tableId);
                    const waitlistPlayers = [...(record.waitlistPlayers || []), playerName];
                    await saveRecord(tableId, { waitlistPlayers, waitlistCount: waitlistPlayers.length });
                }
                return;
            }
            if (target.closest('.export-csv-button')) {
                await exportTableDataToCSV(tableId);
                return;
            }
            const waitlistButton = target.closest('.waitlist-action-button');
            if (waitlistButton) {
                const row = waitlistButton.closest('tr');
                const playerName = row.querySelector('td').textContent.trim();
                const record = await getRecord(tableId);
                let list = record.waitlistPlayers ? [...record.waitlistPlayers] : [];
                if (waitlistButton.classList.contains('seat-player')) {
                    seatingFromWaitlist = playerName;
                    tableSection.classList.add('seating-mode');
                }
                list = list.filter(p => p !== playerName);
                await saveRecord(tableId, { waitlistPlayers: list, waitlistCount: list.length });
                return;
            }
            if (target.closest('.marquee-banner-container')) {
                const marqueeTextEl = target.closest('.marquee-banner-container').querySelector('.marquee-banner-text');
                const result = await Swal.fire({ title: 'Editar Anuncio', input: 'text', inputValue: marqueeTextEl.textContent, showCancelButton: true });
                if (result.isConfirmed) await saveRecord(tableId, { marqueeText: result.value });
                return;
            }
            if (target.closest('.test-banner-button')) {
                const banner = tableSection.querySelector('.rake-banner');
                if (banner) {
                    banner.style.display = 'block';
                    setTimeout(() => { banner.style.display = 'none'; }, 5000);
                }
                return;
            }
        });

        tableSection.querySelector('.status-select').addEventListener('change', async (e) => {
            const newStatus = e.target.value;
            const record = await getRecord(tableId);
            if (!record || newStatus === record.tableStatus) return;

            const updateData = { tableStatus: newStatus };

            // Primero, si la mesa estaba ACTIVA, calculamos y guardamos el tiempo transcurrido.
            if (record.tableStatus === STATUS_ACTIVE) {
                const now = Date.now();
                if (record.mainTimerStartTime && record.mainTimerStartTime.toDate) {
                    const elapsed = (now - record.mainTimerStartTime.toDate().getTime()) / 1000;
                    updateData.mainTimerSeconds = (record.mainTimerSeconds || 0) + elapsed;
                }
                for (let i = 1; i <= 9; i++) {
                    if (record[`seat_${i}_player`] && record[`seat_${i}_startTime`] && record[`seat_${i}_startTime`].toDate) {
                        const seatElapsed = (now - record[`seat_${i}_startTime`].toDate().getTime()) / 1000;
                        updateData[`seat_${i}_seconds`] = (record[`seat_${i}_seconds}`] || 0) + seatElapsed;
                    }
                }
            }
            
            // Ahora, aplicamos el nuevo estado.
            if (newStatus === STATUS_ACTIVE) {
                updateData.mainTimerStartTime = serverTimestamp();
                // Si venimos de INACTIVO, explícitamente reseteamos los segundos
                if (record.tableStatus === STATUS_INACTIVE) {
                    updateData.mainTimerSeconds = 0;
                }
                for (let i = 1; i <= 9; i++) {
                    if (record[`seat_${i}_player`] || updateData[`seat_${i}_player`]) {
                         if (record.tableStatus === STATUS_INACTIVE) {
                           updateData[`seat_${i}_seconds`] = 0;
                        }
                        updateData[`seat_${i}_startTime`] = serverTimestamp();
                    }
                }
            } else { // Para PAUSADO o INACTIVO
                updateData.mainTimerStartTime = null;
                for (let i = 1; i <= 9; i++) {
                    updateData[`seat_${i}_startTime`] = null;
                }

                if (newStatus === STATUS_INACTIVE) {
                    updateData.mainTimerSeconds = 0;
                    updateData.playerCount = 0;
                    for (let i = 1; i <= 9; i++) {
                        updateData[`seat_${i}_seconds`] = 0;
                        updateData[`seat_${i}_player`] = null;
                        updateData[`seat_${i}_avatar`] = null;
                    }
                }
            }
            await saveRecord(tableId, updateData);
        });

        const fields = [{ s: '.value-mesa-display', k: 'tableVisualNumber' }, { s: '.value-juego-ontable', k: 'gameType' }, { s: '.value-blinds-ontable', k: 'blinds' }, { s: '.value-buyin-ontable', k: 'buyinRange' }];
        fields.forEach(f => {
            const el = tableSection.querySelector(f.s);
            if (el) el.addEventListener('blur', () => saveRecord(tableId, { [f.k]: el.textContent.trim() }));
        });

        tableSection.querySelectorAll('.seat').forEach(seat => {
            if (seat.dataset.seat === "10") return;
            seat.addEventListener("mouseenter", async () => {
                if (seat.classList.contains("occupied") && playerInfoCardElement) {
                    const playerName = seat.dataset.playerName;
                    const currentRecord = await getRecord(tableId); if (!currentRecord) return;
                    const playerData = (currentRecord.players || []).find(p => p.name === playerName && !p.leaveTime);
                    const seatNumber = seat.dataset.seat;
                    let secondsToShow = currentRecord[`seat_${seatNumber}_seconds`] || 0;

                    if (currentRecord.tableStatus === STATUS_ACTIVE && currentRecord[`seat_${seatNumber}_startTime`]?.toDate) {
                        const elapsed = (Date.now() - currentRecord[`seat_${seatNumber}_startTime`].toDate().getTime()) / 1000;
                        secondsToShow += elapsed;
                    }

                    playerInfoCardAvatarContainer.innerHTML = seat.querySelector('.seat-content').innerHTML;
                    playerInfoCardNameElement.textContent = playerName;
                    playerInfoCardTimeElement.textContent = formatTime(secondsToShow);
                    playerInfoCardNumBuyinsElement.textContent = playerData?.buyIns?.length || 0;
                    playerInfoCardTotalBuyinsElement.textContent = (playerData?.buyIns?.reduce((sum, buyIn) => sum + (parseFloat(buyIn.amount) || 0), 0) || 0).toLocaleString();
                    playerInfoCardElement.classList.add('visible');
                }
            });
            seat.addEventListener("mouseleave", () => {
                if (playerInfoCardElement) playerInfoCardElement.classList.remove('visible');
            });
        });
    }

    function updateTableUI(tableId, data) {
        const tableSection = document.querySelector(`[data-table-id="${tableId}"]`);
        if (!tableSection) return;

        const state = localTableState[tableId] || {};
        localTableState[tableId] = state; 
        if (state.timerInterval) clearInterval(state.timerInterval);
        
        state.lastRakeCheck = Math.floor((data.mainTimerSeconds || 0) / RAKE_INTERVAL_SECONDS);

        const updateText = (selector, value) => { const el = tableSection.querySelector(selector); if (el) el.textContent = value || ''; };
        updateText('.value-mesa-display', data.tableVisualNumber);
        updateText('.value-juego-ontable', data.gameType);
        updateText('.value-blinds-ontable', data.blinds);
        updateText('.value-buyin-ontable', data.buyinRange);
        updateText('.marquee-banner-text', data.marqueeText);
        updateText('.seats-value', 9 - (data.playerCount || 0));
        tableSection.querySelector('.status-select').value = data.tableStatus;

        const mainTimerSpan = tableSection.querySelector('.timer-value');
        if (data.tableStatus === STATUS_ACTIVE && data.mainTimerStartTime?.toDate) {
            const mainTimerStartMillis = data.mainTimerStartTime.toDate().getTime();
            const mainTimerAccumulatedSecs = data.mainTimerSeconds || 0;

            state.timerInterval = setInterval(() => {
                const now = Date.now();
                const mainElapsedSecs = (now - mainTimerStartMillis) / 1000;
                const totalSeconds = mainTimerAccumulatedSecs + mainElapsedSecs;
                mainTimerSpan.textContent = formatTime(totalSeconds);

                const currentRakePeriod = Math.floor(totalSeconds / RAKE_INTERVAL_SECONDS);
                if (currentRakePeriod > 0 && currentRakePeriod > state.lastRakeCheck) {
                    state.lastRakeCheck = currentRakePeriod;
                    const banner = tableSection.querySelector('.rake-banner');
                    if (banner) {
                        banner.style.display = 'block';
                        setTimeout(() => { banner.style.display = 'none'; }, 20 * 1000);
                    }
                }
            }, 1000);
        } else {
            mainTimerSpan.textContent = formatTime(data.mainTimerSeconds || 0);
        }

        const statusIcon = tableSection.querySelector('.status-icon');
        switch (data.tableStatus) {
            case STATUS_ACTIVE: statusIcon.textContent = '🟢'; break;
            case STATUS_PAUSED: statusIcon.textContent = '⏸️'; break;
            case STATUS_INACTIVE: statusIcon.textContent = '🔴'; break;
            default: statusIcon.textContent = '🔴'; break;
        }

        tableSection.querySelectorAll('.seat').forEach(seat => {
            const seatNumber = seat.dataset.seat;
            if (seatNumber === "10") {
                seat.querySelector('img').src = dealerImages[data.dealerImageIndex || 0];
                return;
            }
            const playerName = data[`seat_${seatNumber}_player`];
            const seatContent = seat.querySelector('.seat-content');
            if (playerName) {
                const avatarValue = data[`seat_${seatNumber}_avatar`];
                const imgData = playerImagesByName.find(i => i.name.toLowerCase() === (avatarValue || '').toLowerCase());
                seatContent.innerHTML = imgData ? `<img src="${imgData.url}" alt="${escapeHTML(avatarValue)}" class="player-avatar">` : escapeHTML(avatarValue || '?');
                seat.classList.add('occupied');
                seat.dataset.playerName = playerName;
            } else {
                seatContent.innerHTML = seatNumber;
                seat.classList.remove('occupied');
                delete seat.dataset.playerName;
            }
        });

        const tbody = tableSection.querySelector('.waitlist-table tbody');
        tbody.innerHTML = '';
        (data.waitlistPlayers || []).forEach(name => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `<td contenteditable="true">${escapeHTML(name)}</td><td style="text-align: right;"><button class="waitlist-action-button seat-player" title="Sentar Jugador"><i class="fas fa-user-check"></i></button><button class="waitlist-action-button remove-player" title="Eliminar de Lista"><i class="fas fa-times"></i></button></td>`;
            tbody.appendChild(newRow);
        });
    }

    function createTableSection(tableId, data) {
        const tableSection = document.createElement('div');
        tableSection.classList.add('table-section', 'side-panel-collapsed');
        tableSection.dataset.tableId = tableId;

        tableSection.innerHTML = `
            <button class="delete-table" title="Eliminar Mesa"><i class="fas fa-trash-alt"></i></button>
            <button class="side-panel-toggle-button" title="Mostrar Panel Lateral"><i class="fas fa-chevron-right"></i></button>
            <div class="side-panel"><h3>Gestión y Espera</h3><div class="side-panel-main-controls"><div class="data-item"><span class="data-icon"><i class="fa-solid fa-hashtag"></i></span><label>Mesa #:</label><span contenteditable="true" class="value value-mesa-display"></span></div><div class="data-item"><span class="data-icon"><i class="fa-solid fa-toggle-on"></i></span><label>Estado:</label><div class="status-control"><select class="value status-select"><option value="${STATUS_INACTIVE}">Inactivo</option><option value="${STATUS_PAUSED}">En Pausa</option><option value="${STATUS_ACTIVE}">Activo</option></select><span class="status-icon">🔴</span></div></div></div><hr class="side-panel-divider"><div class="waitlist-section"><h4>Lista de Espera</h4><div class="waitlist-table-container"><table class="waitlist-table"><tbody></tbody></table></div></div><hr class="side-panel-divider"><div class="side-panel-actions"><button class="add-waitlist-row" title="Añadir Jugador a Lista de Espera"><i class="fas fa-user-plus"></i> Añadir a Lista</button><button class="export-csv-button" title="Exportar Datos a CSV"><i class="fas fa-file-csv"></i> Exportar</button><button class="test-banner-button" title="Probar Banner de Rake"><i class="fas fa-eye"></i> Probar Banner</button></div></div>
            <div class="diagram-container"><div class="banner game-type-banner-main"><i class="fa-solid fa-dice-d20"></i>&nbsp;<span contenteditable="true" class="value-juego-ontable"></span></div><div class="table"><img src="https://i.postimg.cc/5yFygKwG/logomjr.png" class="table-felt-logo"><div class="on-table-data-display"><div class="on-table-item blinds-display"><i class="fa-solid fa-coins"></i>&nbsp;<span contenteditable="true" class="value-blinds-ontable"></span></div><div class="on-table-item buyin-display"><i class="fa-solid fa-money-bill-wave"></i>&nbsp;<span contenteditable="true" class="value-buyin-ontable"></span></div><div class="on-table-item active-time-display"><i class="fa-regular fa-clock"></i>&nbsp;<span class="timer-value">00:00:00</span></div><div class="on-table-item available-seats-display"><i class="fa-solid fa-chair"></i>&nbsp;<span class="seats-value">9</span> Asientos Disp.</div></div><div class="rake-banner" style="display: none;">⚠️ ¡Tiempo de Rake! ⚠️</div>${[...Array(9).keys()].map(i => `<div class="seat" data-seat="${i+1}"><div class="seat-content">${i+1}</div></div>`).join('')}<div class="seat" data-seat="10"><img src="" alt="Dealer"></div></div><div class="marquee-banner-container"><div class="marquee-banner-text"></div></div></div>
        `;

        mainContainer.insertBefore(tableSection, addTableButton);
        addEventListeners(tableSection, tableId);
        updateTableUI(tableId, data);
    }

    function initializeApp() {
        mainContainer.innerHTML = '';
        mainContainer.appendChild(addTableButton);

        mesasCollection.onSnapshot(snapshot => {
            snapshot.docChanges().forEach((change) => {
                const docId = change.doc.id;
                const docData = change.doc.data();
                const existingElement = document.querySelector(`[data-table-id="${docId}"]`);

                if (change.type === "removed") {
                    if (existingElement) {
                        const state = localTableState[docId];
                        if (state && state.timerInterval) clearInterval(state.timerInterval);
                        delete localTableState[docId];
                        existingElement.remove();
                    }
                } else if (change.type === "added") {
                    if (!existingElement) createTableSection(docId, docData);
                } else if (change.type === "modified") {
                    if (existingElement) updateTableUI(docId, docData);
                }
            });

            if (snapshot.empty) {
                const noTablesMessage = document.createElement('p');
                noTablesMessage.textContent = 'No hay mesas activas. ¡Crea una para empezar!';
                noTablesMessage.style.color = '#ccc';
                noTablesMessage.id = 'no-tables-message';
                if (!document.getElementById('no-tables-message')) {
                    mainContainer.insertBefore(noTablesMessage, addTableButton);
                }
            } else {
                const noTablesMessage = document.getElementById('no-tables-message');
                if (noTablesMessage) noTablesMessage.remove();
            }

            adjustLayoutForTables();
        }, error => {
            console.error("Error en el listener de Firestore:", error);
            mainContainer.innerHTML = `<p style="color: red;">Error de conexión con la base de datos. ${error.code === 'resource-exhausted' ? 'Se ha excedido la cuota de uso.' : ''}</p>`;
        });
    }

    if (addTableButton) {
        addTableButton.addEventListener('click', async () => {
            await startSession(generateTableId());
        });
    }

    initializePlayerInfoCardElements();
    initializeApp();
});
 // ← cierre DOMContentLoaded

  // ================================================
  // 4️⃣ Listener de logout
  // ================================================
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    logout().then(() => window.location.replace('/index.html'));
  });
} // ← cierre initStaffApp()
