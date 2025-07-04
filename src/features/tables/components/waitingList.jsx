import React, { useState, useEffect } from 'react';
import { tableService } from '../services/tableService';
import Button from '@shared/components/ui/Button';
import DraggablePlayer from '@shared/components/ui/DraggablePlayer';
import './WaitingList.css'; // Importa los estilos
import toast from 'react-hot-toast'; // Importa toast para notificaciones

const WaitingList = ({ tableId, tableData }) => { // Añade tableData como prop
  const [waitingList, setWaitingList] = useState([]);
  const [newPlayer, setNewPlayer] = useState({ name: '', buyIn: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Escuchar cambios en la lista de espera
  useEffect(() => {
    if (!tableId) return;
    
    const unsubscribe = tableService.listenToTable(tableId, (table) => {
      setWaitingList(table.waitingList || []);
    });
    
    return () => unsubscribe();
  }, [tableId]);

  const handleAddPlayer = async () => {
    if (!newPlayer.name.trim()) {
      setError('Nombre es requerido');
      return;
    }
    
    if (newPlayer.buyIn < 0) {
      setError('El buy-in no puede ser negativo');
      return;
    }
    
    // Verificar duplicados
    if (waitingList.some(p => p.name.toLowerCase() === newPlayer.name.toLowerCase())) {
      setError('Este jugador ya está en la lista');
      return;
    }
    
    setLoading(true);
    try {
      await tableService.addPlayerToWaitingList(tableId, {
        id: `temp-${Date.now()}`,
        name: newPlayer.name,
        buyIn: Number(newPlayer.buyIn) || 0
      });
      setNewPlayer({ name: '', buyIn: 0 });
      setError('');
      toast.success('Jugador añadido a la lista');
    } catch (err) {
      setError('Error agregando jugador: ' + err.message);
      toast.error('Error agregando jugador');
    } finally {
      setLoading(false);
    }
  };

  // FUNCIÓN MEJORADA CON VERIFICACIÓN DE ASIENTO OCUPADO
  const handleAssignSeat = async (playerId, seatNumber) => {
    // Verificar si el asiento está ocupado
    const seatKey = `seat${seatNumber}`;
    
    if (tableData?.seats[seatKey]) {
      toast.error(`El asiento ${seatNumber} está ocupado`);
      return;
    }
    
    try {
      await tableService.assignPlayerFromWaitingList(tableId, playerId, seatNumber);
      toast.success(`Jugador asignado al asiento ${seatNumber}`);
    } catch (err) {
      toast.error('Error asignando asiento: ' + err.message);
    }
  };

  return (
    <div className="waiting-list-panel">
      <h3>Lista de Espera</h3>
      
      <div className="add-player-form">
        <input
          type="text"
          placeholder="Nombre del jugador"
          value={newPlayer.name}
          onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
          disabled={loading}
          aria-label="Nombre del jugador"
        />
        <input
          type="number"
          placeholder="Buy-in"
          value={newPlayer.buyIn}
          onChange={(e) => setNewPlayer({...newPlayer, buyIn: e.target.value})}
          min="0"
          disabled={loading}
          aria-label="Buy-in"
        />
        <Button 
          onClick={handleAddPlayer}
          loading={loading}
        >
          Agregar
        </Button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="player-list">
        {waitingList.map(player => (
          <div key={player.id} className="waiting-player">
            <DraggablePlayer player={player} />
            <div className="actions">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(seat => (
                <Button 
                  key={`${player.id}-${seat}`}
                  size="sm"
                  className={tableData?.seats[`seat${seat}`] ? 'occupied' : ''}
                  disabled={tableData?.seats[`seat${seat}`]}
                  onClick={() => handleAssignSeat(player.id, seat)}
                >
                  Asiento {seat}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WaitingList;