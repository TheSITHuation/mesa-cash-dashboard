// src/utils/tableTemplates.js

export function generatePublicTableHTML(tableId) {
  return `
    <div class="table-section" data-table-id="${tableId}">
      <div class="diagram-container">
        <div class="table">
          <img src="https://i.postimg.cc/5yFygKwG/logomjr.png" class="table-felt-logo">
          <div class="on-table-data-display">
            <div class="on-table-item blinds-display"><i class="fa-solid fa-coins"></i>&nbsp;<span class="value-blinds-ontable"></span></div>
            <div class="on-table-item buyin-display"><i class="fa-solid fa-money-bill-wave"></i>&nbsp;<span class="value-buyin-ontable"></span></div>
            <div class="on-table-item active-time-display"><i class="fa-regular fa-clock"></i>&nbsp;<span class="timer-value">00:00:00</span></div>
            <div class="on-table-item available-seats-display"><i class="fa-solid fa-chair"></i>&nbsp;<span class="seats-value">9</span> Asientos Disp.</div>
          </div>
          ${[...Array(9).keys()].map(i => `<div class="seat" data-seat="${i+1}"><div class="seat-content">${i+1}</div></div>`).join('')}
          <div class="seat" data-seat="10"><img src="" alt="Dealer"></div>
        </div>
      </div>
      <div class="public-waitlist-container" style="display: none;">
        <h3>Lista de Espera</h3>
        <ul class="public-waitlist"></ul>
      </div>
    </div>
  `;
}

export function generateFullTableHTML(tableId) {
  return `
    <div class="table-section" data-table-id="${tableId}">
      <div class="panel-trigger-zone"></div>

      <div class="side-panel">
        <div class="panel-header"><h3>Gestión de Mesa</h3></div>
        <div class="panel-content">
          <div class="side-panel-main-controls">
            <div class="data-item"><span class="data-icon">#</span><label>Mesa:</label><span contenteditable="true" class="value value-mesa-display">${tableId}</span></div>
            <div class="data-item">
              <span class="data-icon"><i class="fa-solid fa-toggle-on"></i></span>
              <label>Estado:</label>
              <div class="status-control">
                <div class="radio-inputs" data-table-id="${tableId}">
                  <label class="radio"><input type="radio" name="status-${tableId}" value="activo"><span class="name">Activa</span></label>
                  <label class="radio"><input type="radio" name="status-${tableId}" value="pausa"><span class="name">Pausa</span></label>
                  <label class="radio"><input type="radio" name="status-${tableId}" value="inactivo"><span class="name">Inactiva</span></label>
                </div>
              </div>
            </div>
          </div>

          <hr class="side-panel-divider">

          <div class="waitlist-section">
            <div class="waitlist-header">
              <h4>Lista de Espera <span class="waitlist-count">(0)</span></h4>
              <div class="waitlist-actions">
                <button class="add-waitlist-row btn-icon" title="Añadir a Lista"><i class="fas fa-user-plus"></i></button>
                <button class="export-csv-button btn-icon" title="Exportar Datos"><i class="fas fa-file-csv"></i></button>
              </div>
            </div>
            <div class="waitlist-table-container">
              <table class="waitlist-table"><tbody></tbody></table>
            </div>
          </div>
        </div>

        <div class="panel-footer">
          <button class="show-on-screen-btn btn-icon" title="Ver en Pantalla"><i class="fas fa-tv"></i></button>
          <button class="delete-table btn-icon" title="Eliminar Mesa"><i class="fas fa-trash-alt"></i></button>
        </div>
      </div>

      <div class="diagram-container">
        <div class="table">
          <img src="https://i.postimg.cc/5yFygKwG/logomjr.png" class="table-felt-logo">
          <div class="on-table-data-display">
            <div class="on-table-item blinds-display"><i class="fa-solid fa-coins"></i>&nbsp;<span contenteditable="true" class="value-blinds-ontable"></span></div>
            <div class="on-table-item buyin-display"><i class="fa-solid fa-money-bill-wave"></i>&nbsp;<span contenteditable="true" class="value-buyin-ontable"></span></div>
            <div class="on-table-item active-time-display"><i class="fa-regular fa-clock"></i>&nbsp;<span class="timer-value">00:00:00</span></div>
            <div class="on-table-item available-seats-display"><i class="fa-solid fa-chair"></i>&nbsp;<span class="seats-value">9</span> Asientos Disp.</div>
          </div>
          <div class="rake-banner" style="display: none;">⚠️ ¡Tiempo de Rake! ⚠️</div>
          ${[...Array(9).keys()].map(i => `<div class="seat" data-seat="${i+1}"><div class="seat-content">${i+1}</div></div>`).join('')}
          <div class="seat" data-seat="10"><img src="" alt="Dealer"></div>
        </div>
      </div>
    </div>
  `;
}
