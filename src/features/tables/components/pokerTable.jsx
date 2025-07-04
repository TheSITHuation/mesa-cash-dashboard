import React from 'react';
import Seat from './Seat';
import { useTable } from '../hooks/useTable';
import './PokerTable.css'; // Importa el CSS aquí

const PokerTable = ({ tableId }) => {
  const { table, loading } = useTable(tableId);

  if (loading) return <div className="loading">Cargando mesa...</div>;
  if (!table) return <div className="error">Mesa no encontrada</div>;

  // Manejar acciones de jugador desde los asientos
  const handlePlayerAction = (action, data) => {
    console.log('Acción en asiento:', action, data);
    // Aquí puedes agregar lógica global si es necesario
  };

  return (
    <div className="poker-table-container">
      <div className="table-info">
        <h2>Mesa #{table.id}</h2>
        <p>Blinds: ${table.blinds.sb}/${table.blinds.bb}</p>
        <p>Buy-in: ${table.buyIn.min} - ${table.buyIn.max}</p>
      </div>
      
      <div className="poker-table">
        {/* Asiento Dealer (posición especial) */}
        <Seat
          key="dealer"
          tableId={tableId}
          seatNumber={0} // Usamos 0 para el dealer
          player={null} // El dealer no es un jugador
          isDealer={true}
          onPlayerAction={handlePlayerAction}
        />
        
        {/* 9 Asientos para jugadores */}
        {Array.from({ length: 9 }).map((_, index) => {
          const seatNum = index + 1;
          const player = table.seats[`seat${seatNum}`] || null;
          
          return (
            <Seat
              key={`seat-${seatNum}`}
              tableId={tableId}
              seatNumber={seatNum}
              player={player}
              isDealer={false}
              onPlayerAction={handlePlayerAction}
            />
          );
        })}
        
        {/* Representación visual de la mesa (círculo) */}
        <div className="table-surface"></div>
      </div>
    </div>
  );
};

export default PokerTable;