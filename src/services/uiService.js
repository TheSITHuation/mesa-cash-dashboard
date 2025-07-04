// /src/services/uiService.js (refactorizado y corregido)

import { generatePublicTableHTML, generateFullTableHTML } from '/src/utils/tableTemplates.js';

let mainContainer;
let modalCardOverlay, modalCardAvatar, modalCardName, modalCardDetails, modalCardCloseBtn;
const timers = {};
const dealerImages = [
  "https://i.postimg.cc/Cxy2YZC6/crupier-1.png", "https://i.postimg.cc/cLQbJsX1/crupier.png", "https://i.postimg.cc/L85YfvRK/1.png",
  "https://i.postimg.cc/xdbXpCc6/2.png", "https://i.postimg.cc/NMq53cXB/3.png", "https://i.postimg.cc/QtQHsyg5/4.png",
  "https://i.postimg.cc/MHzXGmtL/5.png", "https://i.postimg.cc/DmkrJBPr/Maria-Alvarado.png"
];

function formatTime(seconds = 0) {
  const h = Math.floor(seconds / 3600), m = Math.floor((seconds % 3600) / 60), s = Math.floor(seconds % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function escapeHTML(str = '') {
  return str.replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
}

export const uiService = {
  init() {
    mainContainer = document.getElementById('mainContainer');
    if (!mainContainer) {
      console.error("El contenedor principal con id 'mainContainer' no fue encontrado en el DOM.");
      return;
    }

    modalCardOverlay = document.getElementById('player-card-modal-overlay');
    modalCardAvatar = document.getElementById('player-card-avatar');
    modalCardName = document.getElementById('player-card-name');
    modalCardDetails = document.getElementById('player-card-details');
    modalCardCloseBtn = document.getElementById('player-card-close');

    if (modalCardCloseBtn) {
      modalCardCloseBtn.addEventListener('click', () => this.hidePlayerCard());
    }
    if (modalCardOverlay) {
      modalCardOverlay.addEventListener('click', (e) => {
        if (e.target === modalCardOverlay) this.hidePlayerCard();
      });
    }
    console.log("UI service initialized");
  },

  formatTime,

  createPublicTableElement(tableId) {
    if (!mainContainer) return;
    const html = generatePublicTableHTML(tableId);
    const wrapper = document.createElement('div');
    wrapper.className = 'table-section public-view';
    wrapper.dataset.tableId = tableId;
    wrapper.innerHTML = html;
    mainContainer.appendChild(wrapper);
  },

  createTableElement(tableId) {
    if (!mainContainer) return;
    const html = generateFullTableHTML(tableId);
    const wrapper = document.createElement('div');
    wrapper.className = 'table-section';
    wrapper.dataset.tableId = tableId;
    wrapper.innerHTML = html;
    mainContainer.appendChild(wrapper);
  },

  removeTableElement(tableId) {
    document.querySelector(`[data-table-id="${tableId}"]`)?.remove();
  },

  adjustLayoutForTables() {
    if (!mainContainer) return;
    const tables = mainContainer.querySelectorAll('.table-section');
    mainContainer.classList.toggle('single-table-view', tables.length === 1);
    mainContainer.classList.toggle('multi-table-view', tables.length > 1);
  },

  showRakeBanner(tableId) {
    const banner = document.querySelector(`[data-table-id="${tableId}"] .rake-banner`);
    if (banner) {
      banner.style.display = 'block';
      setTimeout(() => { banner.style.display = 'none'; }, 20000);
    }
  },

  showPlayerCard(playerData, seatData, avatarHTML) {
    if (!modalCardOverlay) return;
    modalCardAvatar.innerHTML = avatarHTML;
    modalCardName.textContent = playerData.name;

    const totalBuyins = playerData.buyIns?.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0) || 0;
    const numBuyins = playerData.buyIns?.length || 0;
    const avgBuyin = numBuyins > 0 ? totalBuyins / numBuyins : 0;
    const joinTime = playerData.joinTime ? new Date(playerData.joinTime).toLocaleString() : "N/A";

    modalCardDetails.innerHTML = `
      <p><i class="fas fa-clock"></i> <strong>Tiempo Jugado:</strong> ${this.formatTime(seatData.seconds)}</p>
      <p><i class="fas fa-sign-in-alt"></i> <strong>Hora de Entrada:</strong> ${joinTime}</p>
      <hr>
      <p><i class="fas fa-shopping-cart"></i> <strong>Número de Compras:</strong> ${numBuyins}</p>
      <p><i class="fas fa-calculator"></i> <strong>Compra Promedio:</strong> $${avgBuyin.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
      <p><i class="fas fa-dollar-sign"></i> <strong>Total Comprado:</strong> $${totalBuyins.toLocaleString()}</p>
    `;

    modalCardOverlay.classList.add('visible');
  },

  hidePlayerCard() {
    if (modalCardOverlay) {
      modalCardOverlay.classList.remove('visible');
    }
  }
};
