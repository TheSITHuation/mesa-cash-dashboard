import React from 'react';
import Button from '@shared/components/ui/Button';
import { tableService } from '../services/tableService';

const TableControls = ({ tableId, tableStatus }) => {
  const handleStatusChange = async (newStatus) => {
    try {
      await tableService.updateTable(tableId, { status: newStatus });
    } catch (err) {
      console.error('Error actualizando estado:', err);
    }
  };

  const handleExportCSV = () => {
    // Implementar exportación
    console.log('Exportando datos de mesa...');
  };

  return (
    <div className="table-controls">
      <h3>Controles de Mesa</h3>
      
      <div className="status-controls">
        <Button 
          variant={tableStatus === 'active' ? 'primary' : 'outline'}
          onClick={() => handleStatusChange('active')}
        >
          Activar
        </Button>
        <Button 
          variant={tableStatus === 'paused' ? 'primary' : 'outline'}
          onClick={() => handleStatusChange('paused')}
        >
          Pausar
        </Button>
        <Button 
          variant={tableStatus === 'inactive' ? 'primary' : 'outline'}
          onClick={() => handleStatusChange('inactive')}
        >
          Desactivar
        </Button>
      </div>
      
      <div className="export-section">
        <Button onClick={handleExportCSV}>
          Exportar a CSV
        </Button>
      </div>
      
      <div className="danger-zone">
        <Button variant="danger">
          Eliminar Mesa
        </Button>
      </div>
    </div>
  );
};

export default TableControls;