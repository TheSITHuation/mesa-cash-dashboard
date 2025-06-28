// /assets/js/eventHandlers.js

// /assets/js/eventHandlers.js

export function attachWaitlistHandlers(tableSection) {
  const tableId = tableSection.dataset.tableId;

  const addBtn = tableSection.querySelector('.add-waitlist-row');
  const tbody = tableSection.querySelector('.waitlist-table tbody');
  const exportBtn = tableSection.querySelector('.export-csv-button');

  // Añadir jugador manualmente
  if (addBtn && tbody) {
    addBtn.addEventListener('click', () => {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td contenteditable="true">Nuevo jugador</td>
        <td style="text-align: right;">
          <button class="waitlist-action-button seat-player" title="Sentar"><i class="fas fa-user-check"></i></button>
          <button class="waitlist-action-button remove-player" title="Eliminar"><i class="fas fa-times"></i></button>
        </td>
      `;
      tbody.appendChild(newRow);
    });
  }

  // Botón para exportar a CSV
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const rows = [...tbody.querySelectorAll('tr')];
      const data = rows.map(tr => tr.children[0].textContent.trim());
      const csv = "data:text/csv;charset=utf-8," + data.join("\\n");
      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csv));
      link.setAttribute("download", `waitlist_${tableId}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Delegación para eliminar y sentar jugadores
  if (tbody) {
    tbody.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      if (btn.classList.contains('remove-player')) {
        btn.closest('tr')?.remove();
      }

      if (btn.classList.contains('seat-player')) {
        const playerName = btn.closest('tr')?.children[0].textContent.trim();
        alert(`Sentar al jugador: ${playerName}`);
        // Aquí podrías agregar integración con Firebase si quieres moverlo a mesa
      }
    });
  }
}
