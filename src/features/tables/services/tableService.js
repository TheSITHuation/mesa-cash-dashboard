import { 
  getDocument,
  updateDocument,
  listenToDocument,
  occupySeat,
  freeSeat,
  cashOutPlayer,
  updatePlayerStack,
  addToWaitingList,
  assignFromWaitingList,
  getCollection,
  listenToCollection,
  addDocument,  // Importamos addDocument para crear mesas
  deleteDocument  // Importamos deleteDocument para eliminar mesas
} from '@shared/api/firebase/firestore';
import { serverTimestamp } from '@shared/api/firebase/config';  // Importamos serverTimestamp

// Servicio optimizado usando las nuevas funciones de firestore.js
export const tableService = {
  // Obtener una mesa específica
  getTable: async (tableId) => {
    return await getDocument('tables', tableId);
  },

  // Escuchar cambios en una mesa en tiempo real
  listenToTable: (tableId, callback, onError) => {
    return listenToDocument('tables', tableId, callback, onError);
  },

  // Actualizar datos generales de la mesa
  updateTable: async (tableId, data) => {
    await updateDocument('tables', tableId, {
      ...data,
      updatedAt: serverTimestamp()  // Añadir marca de tiempo
    });
  },

  // Asignar jugador a un asiento
  assignPlayerToSeat: async (tableId, seatNumber, player) => {
    await occupySeat(tableId, seatNumber, player);
  },

  // Liberar un asiento
  freeSeat: async (tableId, seatNumber) => {
    await freeSeat(tableId, seatNumber);
  },

  // Realizar cash out de un jugador
  cashOutPlayer: async (tableId, seatNumber, playerId) => {
    await cashOutPlayer(tableId, seatNumber, playerId);
  },

  // Añadir fichas a un jugador (rebuy)
  addRebuy: async (tableId, seatNumber, amount) => {
    await updatePlayerStack(tableId, seatNumber, amount);
  },

  // Obtener todas las mesas
  getAllTables: async () => {
    return await getCollection('tables');
  },

  // Escuchar cambios en todas las mesas (CORREGIDO)
  listenToAllTables: (callback, onError) => {
    return listenToCollection('tables', null, callback, onError);
  },

  // Obtener mesas por estado
  getTablesByStatus: async (status) => {
    return await getCollection('tables', [['status', '==', status]]);
  },

  // Añadir jugador a lista de espera
  addPlayerToWaitingList: async (tableId, player) => {
    await addToWaitingList(tableId, {
      ...player,
      joinedAt: serverTimestamp()
    });
  },

  // Asignar jugador desde lista de espera a asiento
  assignPlayerFromWaitingList: async (tableId, playerId, seatNumber) => {
    await assignFromWaitingList(tableId, playerId, seatNumber);
  },

  // Crear una nueva mesa (CORREGIDO)
  createTable: async (tableData) => {
    const tableId = tableData.id;
    
    // Primero verificar si la mesa ya existe
    const existingTable = await getDocument('tables', tableId);
    if (existingTable) {
      throw new Error(`La mesa ${tableId} ya existe`);
    }
    
    // Crear estructura de asientos
    const seats = {};
    for (let i = 1; i <= 9; i++) {
      seats[`seat${i}`] = null;
    }
    
    // Crear la mesa
    await addDocument('tables', {
      ...tableData,
      seats,
      waitingList: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'inactive'
    }, tableId); // Especificamos el ID del documento
    
    return tableId;
  },

  // Eliminar una mesa
  deleteTable: async (tableId) => {
    await deleteDocument('tables', tableId);
  },

  // Cambiar estado de la mesa
  setTableStatus: async (tableId, status) => {
    await updateDocument('tables', tableId, {
      status,
      updatedAt: serverTimestamp()
    });
  }
};