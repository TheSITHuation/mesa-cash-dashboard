// features/tables/components/SeatActionsModal.jsx
import React, { useState } from 'react';
import Button from '@shared/components/ui/Button';
import Modal from '@shared/components/ui/Modal';

const SeatActionsModal = ({ player, onAction, onClose, disabled }) => {
  const [rebuyAmount, setRebuyAmount] = useState(player.buyIn || 0);
  const [selectedAction, setSelectedAction] = useState(null);

  const handleConfirm = () => {
    if (selectedAction === 'REBUY') {
      onAction(selectedAction, { amount: rebuyAmount });
    } else {
      onAction(selectedAction);
    }
  };

  return (
    <Modal 
      title={`Acciones: ${player.name}`}
      onClose={onClose}
      size="sm"
    >
      <div className="seat-actions-modal">
        <div className="action-group">
          <h4>Seleccione una acción:</h4>
          
          <div className="action-options">
            <Button
              variant={selectedAction === 'CASH_OUT' ? 'primary' : 'outline'}
              onClick={() => setSelectedAction('CASH_OUT')}
              disabled={disabled}
            >
              Cash Out (${player.stack})
            </Button>
            
            <Button
              variant={selectedAction === 'REBUY' ? 'primary' : 'outline'}
              onClick={() => setSelectedAction('REBUY')}
              disabled={disabled}
            >
              Recargar Fichas
            </Button>
            
            <Button
              variant={selectedAction === 'SIT_OUT' ? 'primary' : 'outline'}
              onClick={() => setSelectedAction('SIT_OUT')}
              disabled={disabled}
            >
              Sentarse Fuera
            </Button>
          </div>
        </div>

        {selectedAction === 'REBUY' && (
          <div className="rebuy-form">
            <label>Cantidad a recargar:</label>
            <input
              type="number"
              value={rebuyAmount}
              onChange={(e) => setRebuyAmount(Number(e.target.value))}
              min="1"
              step="1"
              disabled={disabled}
            />
          </div>
        )}

        <div className="modal-footer">
          <Button 
            variant="secondary" 
            onClick={onClose}
            disabled={disabled}
          >
            Cancelar
          </Button>
          
          <Button 
            variant="primary"
            onClick={handleConfirm}
            disabled={!selectedAction || disabled}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SeatActionsModal;