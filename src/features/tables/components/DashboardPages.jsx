// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import PokerTable from '@features/tables/components/PokerTable';
import WaitingList from '@features/tables/components/WaitingList';
import TableControls from '@features/tables/components/TableControls';
import { useAuth } from '@features/auth/hooks/useAuth';
import { tableService } from '@features/tables/services/tableService';
import Button from '@shared/components/ui/Button';
import './DashboardPage.css'; // Asegúrate de crear este archivo

const DashboardPage = () => {
  const { user } = useAuth();
  const [tables, setTables] = useState([]); // Todas las mesas disponibles
  const [currentTableId, setCurrentTableId] = useState(null); // Mesa seleccionada
  const [tableData, setTableData] = useState(null); // Datos de la mesa actual
  const [loadingTables, setLoadingTables] = useState(true); // Estado de carga
  const [error, setError] = useState(''); // Mensajes de error

  // 1. Cargar todas las mesas disponibles
  useEffect(() => {
    if (!user) return;
    
    setLoadingTables(true);
    const unsubscribe = tableService.listenToAllTables((tables) => {
      setTables(tables);
      
      // Seleccionar la primera mesa si no hay ninguna seleccionada
      if (!currentTableId && tables.length > 0) {
        setCurrentTableId(tables[0].id);
      }
      
      setLoadingTables(false);
    }, (error) => {
      setError('Error cargando mesas: ' + error.message);
      setLoadingTables(false);
    });
    
    return () => unsubscribe();
  }, [user]);

  // 2. Escuchar cambios en la mesa actual
  useEffect(() => {
    if (!currentTableId) return;
    
    const unsubscribe = tableService.listenToTable(currentTableId, (table) => {
      setTableData(table);
    }, (error) => {
      setError('Error cargando mesa: ' + error.message);
    });
    
    return () => unsubscribe();
  }, [currentTableId]);

  // Crear una nueva mesa
  const handleCreateTable = async () => {
    try {
      const tableId = prompt("Ingrese ID de la nueva mesa:");
      if (!tableId) return;
      
      await tableService.createTable({
        id: tableId,
        blinds: { sb: 1, bb: 2 },
        buyIn: { min: 100, max: 500 },
        status: 'inactive'
      });
      toast.success(`Mesa ${tableId} creada`);
    } catch (err) {
      toast.error('Error creando mesa: ' + err.message);
    }
  };

  if (!user || user.role !== 'staff') {
    return (
      <div className="unauthorized">
        <h2>Acceso restringido</h2>
        <p>Solo personal autorizado puede acceder a esta sección</p>
      </div>
    );
  }

  if (loadingTables) {
    return <div className="loading">Cargando mesas...</div>;
  }

  if (tables.length === 0) {
    return (
      <div className="no-tables">
        <h2>No hay mesas disponibles</h2>
        <Button onClick={handleCreateTable}>Crear nueva mesa</Button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Selector de mesas */}
      <div className="table-selector">
        <label>Seleccionar mesa:</label>
        <select 
          value={currentTableId || ''}
          onChange={(e) => setCurrentTableId(e.target.value)}
          disabled={tables.length === 0}
        >
          {tables.map(table => (
            <option key={table.id} value={table.id}>
              Mesa {table.id} - {table.status}
            </option>
          ))}
        </select>
        
        <Button variant="primary" onClick={handleCreateTable}>
          + Nueva Mesa
        </Button>
      </div>
      
      {/* Mostrar error si existe */}
      {error && <div className="error-message">{error}</div>}
      
      {/* Contenido principal */}
      {currentTableId ? (
        <>
          <div className="table-section">
            <PokerTable tableId={currentTableId} />
          </div>
          
          <div className="management-section">
            <TableControls 
              tableId={currentTableId} 
              tableStatus={tableData?.status || 'inactive'} 
            />
            
            <WaitingList 
              tableId={currentTableId} 
              tableData={tableData}
            />
          </div>
        </>
      ) : (
        <div className="no-table-selected">
          <p>Seleccione una mesa para comenzar</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;