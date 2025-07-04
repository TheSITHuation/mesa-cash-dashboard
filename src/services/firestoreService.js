// /src/services/firestoreService.js

// IMPORTANTE: Importamos la variable 'db' desde nuestro archivo de inicialización.
// Esto soluciona el error "db is not defined".
import { db } from '/src/firebase-init.js'; 

// --- INICIO DE LA CORRECCIÓN ---
// Usamos el nombre de colección correcto ("mesas") en todo el archivo.
const mesasCollection = db.collection("mesas");

// Usamos el objeto global 'firebase' (de los scripts "compat") para las funciones especiales.
const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
const increment = firebase.firestore.FieldValue.increment;
// --- FIN DE LA CORRECCIÓN ---


// Funciones auxiliares que ya tenías
async function saveRecord(tableId, record) {
    try {
        await mesasCollection.doc(tableId).set(record, { merge: true });
    } catch (e) {
        console.error("Error guardando registro:", e);
    }
}

async function getRecord(tableId) {
    try {
        const doc = await mesasCollection.doc(tableId).get();
        return doc.exists ? doc.data() : null;
    } catch (e) {
        console.error("Error obteniendo registro:", e);
        return null;
    }
}


// Exportamos el objeto del servicio con todas las funciones públicas
export const firestoreService = {

    onTablesSnapshot(callback) {
        // Esta función escucha cambios en TODAS las mesas
        return mesasCollection.onSnapshot(callback, error => {
            console.error("Error en el listener de Firestore:", error);
        });
    },
    
    onSpecificTableSnapshot(tableId, callback) {
        // CORREGIDO: Esta función ahora usa 'mesasCollection' que apunta al nombre correcto.
        return mesasCollection.doc(tableId).onSnapshot(callback, error => {
            console.error(`Error en el listener para la mesa ${tableId}:`, error);
        });
    },

    getRecord, // Hacemos la función getRecord pública

    async startNewSession(tableId, tableNumber) {
        const record = {
            tableId, 
            creationTime: serverTimestamp(), 
            players: [], 
            buyIns: [], 
            mainTimerSeconds: 0,
            mainTimerStartTime: null, 
            marqueeText: "✨ Skampa Poker Room Anuncios! ✨",
            tableVisualNumber: String(tableNumber), 
            gameType: 'NLHE', 
            blinds: '25 / 25',
            buyinRange: '$1,000 - $5,000', 
            tableStatus: 'inactivo', 
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
    },

    async deleteRecord(tableId) {
        try {
            await mesasCollection.doc(tableId).delete();
        } catch (e) {
            console.error("Error eliminando registro:", e);
        }
    },
    
    async updateField(tableId, fieldKey, value) {
        await saveRecord(tableId, { [fieldKey]: value });
    },

    async updateTableStatus(tableId, newStatus) {
        const record = await getRecord(tableId);
        if (!record || newStatus === record.tableStatus) return;
        const updateData = { tableStatus: newStatus };
        const now = Date.now();
        if (record.tableStatus === 'activo') {
            if (record.mainTimerStartTime?.toDate) {
                const elapsed = (now - record.mainTimerStartTime.toDate().getTime()) / 1000;
                updateData.mainTimerSeconds = (record.mainTimerSeconds || 0) + elapsed;
            }
            for (let i = 1; i <= 9; i++) {
                if (record[`seat_${i}_player`] && record[`seat_${i}_startTime`]?.toDate) {
                    const seatElapsed = (now - record[`seat_${i}_startTime`].toDate().getTime()) / 1000;
                    updateData[`seat_${i}_seconds`] = (record[`seat_${i}_seconds}`] || 0) + seatElapsed;
                }
            }
        }
        if (newStatus === 'activo') {
            updateData.mainTimerStartTime = serverTimestamp();
            if (record.tableStatus === 'inactivo') updateData.mainTimerSeconds = 0;
            for (let i = 1; i <= 9; i++) {
                if (record[`seat_${i}_player`]) {
                    if (record.tableStatus === 'inactivo') updateData[`seat_${i}_seconds`] = 0;
                    updateData[`seat_${i}_startTime`] = serverTimestamp();
                }
            }
        } else {
            updateData.mainTimerStartTime = null;
            for (let i = 1; i <= 9; i++) updateData[`seat_${i}_startTime`] = null;
        }
        if (newStatus === 'inactivo') {
            updateData.mainTimerSeconds = 0; updateData.playerCount = 0;
            for (let i = 1; i <= 9; i++) {
                updateData[`seat_${i}_seconds`] = 0; updateData[`seat_${i}_player`] = null; updateData[`seat_${i}_avatar`] = null;
            }
        }
        await saveRecord(tableId, updateData);
    },

    async occupySeat(tableId, seatNumber, playerName, avatarName) {
        const record = await getRecord(tableId);
        if (!record) return;
        const updateData = {
            [`seat_${seatNumber}_player`]: playerName, [`seat_${seatNumber}_avatar`]: avatarName,
            [`seat_${seatNumber}_seconds`]: 0,
            [`seat_${seatNumber}_startTime`]: (record.tableStatus === 'activo') ? serverTimestamp() : null,
            playerCount: increment(1)
        };
        const players = record.players || [];
        if (!players.find(p => p.name === playerName && !p.leaveTime)) {
            players.push({ name: playerName, joinTime: new Date().toISOString(), leaveTime: null, buyIns: [] });
            updateData.players = players;
        }
        await saveRecord(tableId, updateData);
    },

    async vacateSeat(tableId, seatNumber) {
        const record = await getRecord(tableId);
        if (!record) return;
        const playerName = record[`seat_${seatNumber}_player`];
        const updateData = {
            [`seat_${seatNumber}_player`]: null, [`seat_${seatNumber}_avatar`]: null, [`seat_${seatNumber}_startTime`]: null
        };
        const seatStartTime = record[`seat_${seatNumber}_startTime`];
        let finalSeconds = record[`seat_${seatNumber}_seconds`] || 0;
        if (record.tableStatus === 'activo' && seatStartTime?.toDate) {
            const elapsed = (Date.now() - seatStartTime.toDate().getTime()) / 1000;
            finalSeconds += elapsed;
        }
        updateData[`seat_${seatNumber}_seconds`] = finalSeconds;
        if (playerName) {
            const updatedPlayers = (record.players || []).map(p => 
                (p.name === playerName && !p.leaveTime) ? { ...p, leaveTime: new Date().toISOString() } : p
            );
            updateData.players = updatedPlayers;
        }
        updateData.playerCount = increment(-1);
        await saveRecord(tableId, updateData);
    },

    async registerBuyIn(tableId, playerName, amount) {
        const record = await getRecord(tableId);
        if (!record) return;
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
    },
    
    async updateWaitlist(tableId, newList) {
        await saveRecord(tableId, { waitlistPlayers: newList, waitlistCount: newList.length });
    },
    
    async changeDealer(tableId, newIndex) {
        await saveRecord(tableId, { dealerImageIndex: newIndex });
    },
};
