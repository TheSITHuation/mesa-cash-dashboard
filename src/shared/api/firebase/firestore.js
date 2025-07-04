import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  addDoc,
  serverTimestamp,
  runTransaction,
  writeBatch,
  arrayUnion,
  arrayRemove,
  increment as firestoreIncrement,
  orderBy,
  limit,
  startAfter
} from "firebase/firestore";
import { db } from './config';

/**
 * Operaciones básicas CRUD para documentos
 */

// Obtener un documento por ID
export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};

// Crear o actualizar un documento
export const saveDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return docId;
  } catch (error) {
    console.error("Error saving document:", error);
    throw error;
  }
};

// Actualizar campos específicos de un documento
export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

// Eliminar un documento
export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

// Escuchar cambios en un documento en tiempo real con manejo de errores
export const listenToDocument = (collectionName, docId, callback, onError) => {
  try {
    const docRef = doc(db, collectionName, docId);
    return onSnapshot(
      docRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          callback({ id: docSnap.id, ...docSnap.data() });
        } else if (onError) {
          onError(new Error("Document does not exist"));
        }
      },
      (error) => {
        if (onError) onError(error);
        console.error("Error listening to document:", error);
      }
    );
  } catch (error) {
    if (onError) onError(error);
    console.error("Error setting up document listener:", error);
  }
};

/**
 * Operaciones para colecciones
 */

// Obtener todos los documentos de una colección
export const getCollection = async (collectionName) => {
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting collection:", error);
    throw error;
  }
};

// Consultar documentos con filtros
export const queryCollection = async (collectionName, conditions) => {
  try {
    const colRef = collection(db, collectionName);
    let q = query(colRef);
    
    conditions.forEach(([field, operator, value]) => {
      q = query(q, where(field, operator, value));
    });
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error querying collection:", error);
    throw error;
  }
};

// Escuchar cambios en una colección en tiempo real con manejo de errores
export const listenToCollection = (collectionName, conditions, callback, onError) => {
  try {
    const colRef = collection(db, collectionName);
    let q = query(colRef);
    
    if (conditions) {
      conditions.forEach(([field, operator, value]) => {
        q = query(q, where(field, operator, value));
      });
    }
    
    return onSnapshot(
      q, 
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(docs);
      },
      (error) => {
        if (onError) onError(error);
        console.error("Error listening to collection:", error);
      }
    );
  } catch (error) {
    if (onError) onError(error);
    console.error("Error setting up collection listener:", error);
  }
};

// Agregar un nuevo documento a una colección (con ID automático o específico)
export const addDocument = async (collectionName, data, docId = null) => {
  try {
    if (docId) {
      // Usar ID específico
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docId;
    } else {
      // ID automático
      const colRef = collection(db, collectionName);
      const docRef = await addDoc(colRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    }
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
};

/**
 * Operaciones avanzadas y específicas para mesas de poker
 */

// Ocupar un asiento en una mesa
export const occupySeat = async (tableId, seatNumber, player) => {
  try {
    const tableRef = doc(db, 'tables', tableId);
    await updateDoc(tableRef, {
      [`seats.seat${seatNumber}`]: {
        playerId: player.id,
        name: player.name,
        avatar: player.avatar,
        stack: player.buyIn || 0,
        status: 'playing',
        joinedAt: serverTimestamp()
      }
    });
  } catch (error) {
    console.error("Error occupying seat:", error);
    throw error;
  }
};

// Liberar un asiento
export const freeSeat = async (tableId, seatNumber) => {
  try {
    const tableRef = doc(db, 'tables', tableId);
    await updateDoc(tableRef, {
      [`seats.seat${seatNumber}`]: null
    });
  } catch (error) {
    console.error("Error freeing seat:", error);
    throw error;
  }
};

// Realizar cash out de un jugador
export const cashOutPlayer = async (tableId, seatNumber, playerId) => {
  try {
    const tableRef = doc(db, 'tables', tableId);
    const playerRef = doc(db, 'players', playerId);
    
    await runTransaction(db, async (transaction) => {
      // 1. Obtener datos actuales
      const tableDoc = await transaction.get(tableRef);
      const playerDoc = await transaction.get(playerRef);
      
      if (!tableDoc.exists() || !playerDoc.exists()) {
        throw new Error("Documento no encontrado");
      }
      
      const seatData = tableDoc.data().seats[`seat${seatNumber}`];
      const currentStack = seatData.stack;
      
      // 2. Actualizar jugador
      transaction.update(playerRef, {
        totalCashOut: firestoreIncrement(currentStack),
        lastCashOut: serverTimestamp()
      });
      
      // 3. Liberar asiento
      transaction.update(tableRef, {
        [`seats.seat${seatNumber}`]: null
      });
      
      // 4. Registrar transacción
      const transactionsRef = collection(db, 'transactions');
      transaction.add(transactionsRef, {
        type: 'cash-out',
        playerId,
        tableId,
        amount: currentStack,
        timestamp: serverTimestamp()
      });
    });
  } catch (error) {
    console.error("Error in cash out transaction:", error);
    throw error;
  }
};

// Añadir un jugador a la lista de espera
export const addToWaitingList = async (tableId, player) => {
  try {
    const tableRef = doc(db, 'tables', tableId);
    await updateDoc(tableRef, {
      waitingList: arrayUnion({
        playerId: player.id,
        name: player.name,
        joinedAt: serverTimestamp()
      })
    });
  } catch (error) {
    console.error("Error adding to waiting list:", error);
    throw error;
  }
};

// Eliminar de lista de espera y asignar asiento
export const assignFromWaitingList = async (tableId, playerId, seatNumber) => {
  try {
    const tableRef = doc(db, 'tables', tableId);
    
    await runTransaction(db, async (transaction) => {
      const tableDoc = await transaction.get(tableRef);
      if (!tableDoc.exists()) {
        throw new Error("Mesa no encontrada");
      }
      
      const tableData = tableDoc.data();
      const waitingList = tableData.waitingList || [];
      
      // Buscar el jugador en la lista de espera
      const playerEntryIndex = waitingList.findIndex(item => item.playerId === playerId);
      if (playerEntryIndex === -1) {
        throw new Error("Jugador no encontrado en lista de espera");
      }
      
      const playerEntry = waitingList[playerEntryIndex];
      
      // Crear nueva lista de espera sin el jugador
      const newWaitingList = [...waitingList];
      newWaitingList.splice(playerEntryIndex, 1);
      
      // Verificar que el asiento esté libre
      if (tableData.seats[`seat${seatNumber}`]) {
        throw new Error(`El asiento ${seatNumber} está ocupado`);
      }
      
      // Actualizar la mesa
      transaction.update(tableRef, {
        waitingList: newWaitingList,
        [`seats.seat${seatNumber}`]: {
          playerId: playerEntry.playerId,
          name: playerEntry.name,
          stack: 0,
          status: 'playing',
          joinedAt: serverTimestamp()
        }
      });
    });
  } catch (error) {
    console.error("Error assigning from waiting list:", error);
    throw error;
  }
};

// Actualizar el stack de un jugador (rebuy)
export const updatePlayerStack = async (tableId, seatNumber, amount) => {
  try {
    const tableRef = doc(db, 'tables', tableId);
    await updateDoc(tableRef, {
      [`seats.seat${seatNumber}.stack`]: firestoreIncrement(amount)
    });
  } catch (error) {
    console.error("Error updating player stack:", error);
    throw error;
  }
};

// Obtener datos básicos de mesa para el index.html público
export const getPublicTableData = async (tableId) => {
  try {
    const table = await getDocument('tables', tableId);
    if (!table) return null;
    
    return {
      tableId: table.id,
      status: table.status,
      blinds: table.blinds,
      buyIn: table.buyIn,
      seats: Object.values(table.seats).filter(seat => seat !== null).length,
      createdAt: table.createdAt
    };
  } catch (error) {
    console.error("Error getting public table data:", error);
    throw error;
  }
};

// Operaciones batch para múltiples actualizaciones
export const batchUpdate = async (operations) => {
  try {
    const batch = writeBatch(db);
    
    operations.forEach(op => {
      const docRef = doc(db, op.collection, op.id);
      if (op.type === 'update') {
        batch.update(docRef, op.data);
      } else if (op.type === 'set') {
        batch.set(docRef, op.data, { merge: true });
      } else if (op.type === 'delete') {
        batch.delete(docRef);
      }
    });
    
    await batch.commit();
  } catch (error) {
    console.error("Error in batch update:", error);
    throw error;
  }
};

// Actualizar múltiples documentos en una colección
export const batchUpdateDocuments = async (collectionName, updates) => {
  try {
    const batch = writeBatch(db);
    
    updates.forEach(({ docId, data }) => {
      const docRef = doc(db, collectionName, docId);
      batch.update(docRef, data);
    });
    
    await batch.commit();
  } catch (error) {
    console.error("Error in batch documents update:", error);
    throw error;
  }
};

// Obtener documentos con paginación
export const getPaginatedCollection = async (collectionName, conditions, pageSize, lastDoc = null) => {
  try {
    const colRef = collection(db, collectionName);
    
    // Construir condiciones de consulta
    const queryConditions = conditions.map(([field, operator, value]) => 
      where(field, operator, value)
    );
    
    // Añadir ordenamiento y límite
    queryConditions.push(orderBy('createdAt'));
    queryConditions.push(limit(pageSize));
    
    // Añadir punto de inicio si está disponible
    if (lastDoc) {
      queryConditions.push(startAfter(lastDoc));
    }
    
    const q = query(colRef, ...queryConditions);
    const snapshot = await getDocs(q);
    
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return { docs, lastVisible };
  } catch (error) {
    console.error("Error getting paginated collection:", error);
    throw error;
  }
};

// Operación para realizar cash out con transacción mejorada
export const processCashOut = async (tableId, seatNumber, playerId) => {
  try {
    await cashOutPlayer(tableId, seatNumber, playerId);
  } catch (error) {
    console.error('Error in cashOutPlayer:', error);
    throw new Error('No se pudo completar el cash out: ' + error.message);
  }
};

// Helper para incrementos/decrementos
export const increment = (n) => firestoreIncrement(n);