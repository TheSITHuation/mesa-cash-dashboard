// features/tables/components/Seat.jsx
import React, { useState } from 'react';
import { tableService } from '../services/tableService';
import SeatActionsModal from './SeatActionsModal';
import Avatar from '@shared/components/ui/Avatar';
import PlayerStatusIndicator from './PlayerStatusIndicator'; // Mantén este si lo tienes

const Seat = ({ 
  tableId, 
  seatNumber, 
  player, 
  isDealer = false, // Nuevo prop para identificar dealer
  onPlayerAction // Callback opcional para notificar acciones
}) => {
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para manejar clic en el asiento
  const handleSeatClick = () => {
    if (player) {
      setIsActionModalOpen(true);
    } else {
      // Aquí puedes implementar lógica para asignar jugador si es necesario
      console.log(`Asiento ${seatNumber} libre - Implementar asignación`);
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
          break;
          
        case 'REBUY':
          await tableService.addRebuy(tableId, seatNumber, data.amount);
          onPlayerAction?.('rebuy', { player, amount: data.amount });
          break;
          
        case 'SIT_OUT':
          // Implementa según tus necesidades
          console.log(`Jugador ${player.name} se sienta fuera`);
          break;
          
        default:
          console.warn('Acción no reconocida:', action);
      }
    } catch (err) {
      setError(`Error en ${action}: ${err.message}`);
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
    isDealer ? 'dealer-seat' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={seatClasses}>
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

// Propiedades por defecto para prevenir errores
Seat.defaultProps = {
  player: null,
  isDealer: false,
  onPlayerAction: () => {}
};

export default React.memo(Seat);