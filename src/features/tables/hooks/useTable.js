import { useState, useEffect } from 'react';
import { tableService } from '../services/tableService';

export const useTable = (tableId) => {
  const [table, setTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tableId) return;

    const unsubscribe = tableService.listenToTable(tableId, (tableData) => {
      setTable(tableData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [tableId]);

  const updateTable = async (data) => {
    try {
      await tableService.updateTable(tableId, data);
    } catch (err) {
      setError(err);
      console.error("Error updating table:", err);
    }
  };

  return { table, loading, error, updateTable };
};