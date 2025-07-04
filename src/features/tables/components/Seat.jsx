// features/tables/components/Seat.jsx
import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { tableService } from '../services/tableService';
import SeatActionsModal from './SeatActionsModal';
import Avatar from '@shared/components/ui/Avatar';
import PlayerStatusIndicator from './PlayerStatusIndicator';
import toast from 'react-hot-toast';

const Seat = ({ 
  tableId, 
  seatNumber, 
  player, 
  isDealer = false,
  onPlayerAction
}) => {
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Configuración de drop target para drag and drop
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'PLAYER',
    drop: (item) => {
      // Lógica para asignar jugador cuando se suelta aquí
      console.log(`Jugador ${item.player.name} soltado en asiento ${seatNumber}`);
      handleAssignPlayer(item.player);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  // Función para asignar jugador al asiento
  const handleAssignPlayer = async (playerData) => {
    if (player) {
      toast.error('El asiento ya está ocupado');
      return;
    }
    
    setIsLoading(true);
    try {
      await tableService.assignPlayerToSeat(tableId, seatNumber, playerData);
      toast.success(`${playerData.name} asignado al asiento ${seatNumber}`);
    } catch (err) {
      toast.error(`Error asignando jugador: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para manejar clic en el asiento
  const handleSeatClick = () => {
    if (player) {
      setIsActionModalOpen(true);
    } else {
      // Lógica para asignar jugador manualmente
      console.log(`Asiento ${seatNumber} libre`);
    }
  };

  // Función para ejecutar acciones desde el modal
  const handleAction = async (action, data = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      switch(action) {
        case 'CASH_OUT':
          await tableService.cashOutPlayer(tableId, seatNumber, player.id);
          onPlayerAction?.('cash_out', { player, seatNumber });
          toast.success('Cash out realizado');
          break;
          
        case 'REBUY':
          await tableService.addRebuy(tableId, seatNumber, data.amount);
          onPlayerAction?.('rebuy', { player, amount: data.amount });
          toast.success('Recarga exitosa');
          break;
          
        case 'SIT_OUT':
          // Implementa según tus necesidades
          console.log(`Jugador ${player.name} se sienta fuera`);
          toast.success('Jugador en descanso');
          break;
          
        default:
          console.warn('Acción no reconocida:', action);
      }
    } catch (err) {
      setError(`Error en ${action}: ${err.message}`);
      toast.error(`Error: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsActionModalOpen(false);
    }
  };

  // Clases CSS para estado del asiento
  const seatClasses = [
    'seat',
    `seat-${seatNumber}`,
    player ? 'occupied' : 'available',
    isDealer ? 'dealer-seat' : '',
    canDrop ? 'can-drop' : '',
    isOver ? 'is-over' : ''
  ].filter(Boolean).join(' ');

  return (
    <div 
      ref={drop}  // Aplicar la referencia drop aquí
      className={seatClasses}
    >
      <div className="seat-content" onClick={handleSeatClick}>
        {player ? (
          <>
            <Avatar 
              src={player.avatar} 
              alt={player.name} 
              size="md"
            />
            <div className="player-info">
              <span className="player-name">{player.name}</span>
              <span className="player-stack">${player.stack}</span>
              {player.status && (
                <PlayerStatusIndicator status={player.status} />
              )}
            </div>
          </>
        ) : (
          <div className="empty-seat-label">
            {isDealer ? 'Dealer' : `Asiento ${seatNumber}`}
          </div>
        )}
      </div>

      {isLoading && (
        <div className="seat-loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      {error && (
        <div className="seat-error-message">
          {error}
        </div>
      )}

      {isActionModalOpen && player && (
        <SeatActionsModal
          player={player}
          onAction={handleAction}
          onClose={() => setIsActionModalOpen(false)}
          disabled={isLoading}
        />
      )}
    </div>
  );
};

Seat.defaultProps = {
  player: null,
  isDealer: false,
  onPlayerAction: () => {}
};

export default React.memo(Seat);