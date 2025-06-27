// /src/services/uiService.js
// Este módulo es responsable de TODA la manipulación del DOM.

const STATUS_ACTIVE = 'activo', STATUS_PAUSED = 'pausa', STATUS_INACTIVE = 'inactivo';
const dealerImages = [
    "https://i.postimg.cc/Cxy2YZC6/crupier-1.png", "https://i.postimg.cc/cLQbJsX1/crupier.png", "https://i.postimg.cc/L85YfvRK/1.png", 
    "https://i.postimg.cc/xdbXpCc6/2.png", "https://i.postimg.cc/NMq53cXB/3.png", "https://i.postimg.cc/QtQHsyg5/4.png", 
    "https://i.postimg.cc/MHzXGmtL/5.png", "https://i.postimg.cc/DmkrJBPr/Maria-Alvarado.png",
];
const playerImagesByName = [
    { name: "Alice", url: "https://i.postimg.cc/MH2WnHQD/Alice.png"}, { name: "Art", url: "https://i.postimg.cc/xCkCkBF0/Art.png"},
    { name: "Ayra", url: "https://i.postimg.cc/QCQj1Dgr/Ayra.png"}, { name: "Barbie", url: "https://i.postimg.cc/gc8zfVCB/Barbie.png"},
    { name: "Batman-90", url: "https://i.postimg.cc/3JZKwKJX/Batman-90.png"}, { name: "Bender", url: "https://i.postimg.cc/pXvWx9xV/Bender.png"},
    { name: "Bugs", url: "https://i.postimg.cc/rwFq0vKv/Bugs-Bunny.png"}, { name: "CH", url: "https://i.postimg.cc/sg6spwW1/CH.png"},
    { name: "GOT", url: "https://i.postimg.cc/ZqWZjpPH/Dhaeris.png"}, { name: "100Dlls", url: "https://i.postimg.cc/tg8bcJ2j/Franklin.png"},
    { name: "Freddy", url: "https://i.postimg.cc/4yVxPVgq/freddy-krueger.png"}, { name: "Gandalf", url: "https://i.postimg.cc/FRcvXvBJ/Gandalf.png"},
    { name: "A52p2", url: "https://i.postimg.cc/pTgdKkgK/GFKnife.png"}, { name: "A52p", url: "https://i.postimg.cc/05wj9Rwn/Ghostface2.png"},
    { name: "Gollum", url: "https://i.postimg.cc/sxrrVLkH/Gollum.png"}, { name: "Goofy", url: "https://i.postimg.cc/QCJrVbs8/Goofy.png"},
    { name: "Itachi", url: "https://i.postimg.cc/66rKH9Zk/Itachi.png"}, { name: "Jason", url: "https://i.postimg.cc/3JjwDX9D/Jason-hoorvees.png"},
    { name: "JW", url: "https://i.postimg.cc/VLP66G98/Jhon-Wick.png"}, { name: "Joker", url: "https://i.postimg.cc/tC9jwLtY/Joker.png"},
    { name: "Justice", url: "https://i.postimg.cc/WbSvvXXS/Justice.png"}, { name: "Liberty", url: "https://i.postimg.cc/g2JPk87p/Liberty.png"},
    { name: "Madara", url: "https://i.postimg.cc/Jz1z3sdY/Madara.png"}, { name: "Merlina", url: "https://i.postimg.cc/0NKR7xxH/Merlina.png"},
    { name: "Mona-Lisa", url: "https://i.postimg.cc/fRrQ3k49/Mona-Lisa.png"}, { name: "Neo", url: "https://i.postimg.cc/x1tT69wf/Neo.png"},
    { name: "Predator", url: "https://i.postimg.cc/xCrrR71j/Predator.png"}, { name: "Rambo", url: "https://i.postimg.cc/V6XxHRJq/Rambo.png"},
    { name: "Rick-S", url: "https://i.postimg.cc/L5Trm8Bh/Rick-S.png"}, { name: "Rogger", url: "https://i.postimg.cc/NFY3hHXW/Rogger.png"},
    { name: "Scooby", url: "https://i.postimg.cc/bNy731pn/Scooby.png"}, { name: "Serena", url: "https://i.postimg.cc/CMsyGcTY/Serena.png"},
    { name: "Skeletor", url: "https://i.postimg.cc/nLrV56xv/skeletor.png"}, { name: "Trooper", url: "https://i.postimg.cc/15vLT43j/Stormtrooper.png"},
    { name: "Titan-A", url: "https://i.postimg.cc/Vk53c1SL/Titan-A.png"}, { name: "Trump-J", url: "https://i.postimg.cc/dVXgsXdR/Trump-J.png"},
    { name: "WDCI", url: "https://i.postimg.cc/tgcRH2R8/WCDI.png"}, { name: "WW", url: "https://i.postimg.cc/C1fhMkz5/William-Wallace.png"},
    { name: "Yamcha", url: "https://i.postimg.cc/5tCT63qh/Yamcha.png"}, { name: "Blue-Demon", url: "https://i.postimg.cc/hjRNdpS0/Blue-Demon.png"}, 
    { name: "Burns", url: "https://i.postimg.cc/Kz7wrBjh/Burns.png"}, { name: "Feliz", url: "https://i.postimg.cc/J01gT0HD/Feliz.png"}, { name: "Mcpato", url: " https://i.postimg.cc/d34fgFGW/Mcpato.png"}, 
    { name: "Monopoly", url: "https://i.postimg.cc/zDj4yC4n/Monopoly.png"}, { name: "Richie-Rich", url: "https://i.postimg.cc/HskRXJCF/Richie-Rich.png"}, 
    { name: "Robocop", url: "https://i.postimg.cc/4N2M5Jfy/Robocop.png"}, { name: "Santo", url: "https://i.postimg.cc/52HrKZy3/Santo.png"},

];

const emojiIcons = ['😎','🤥','🥸','😀','🤑','😉','😡','🤠','🤩','🤔','😴','😏','🤯','🥶','👽','💩','🥷🏻'];
let currentEmojiIndex = 0;

let mainContainer;
let modalCardOverlay, modalCardAvatar, modalCardName, modalCardDetails, modalCardCloseBtn;
const timers = {}; // Objeto para manejar los intervalos de tiempo

function formatTime(seconds = 0) {
    const h = Math.floor(seconds / 3600), m = Math.floor((seconds % 3600) / 60), s = Math.floor(seconds % 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function escapeHTML(str = '') {
    return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
}

export const uiService = {
    init() {
        mainContainer = document.getElementById('mainContainer');
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
        console.log("Servicio de UI inicializado.");
    },

    formatTime,
    getDealerImagesCount() {
        return dealerImages.length;
    },

    createPublicTableElement(tableId) {
        const tableSection = document.createElement('div');
        tableSection.className = 'table-section public-view';
        tableSection.dataset.tableId = tableId;
        // Se añade el contenedor para la lista de espera
        tableSection.innerHTML = `
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
        `;
        mainContainer.appendChild(tableSection);
    },

    createTableElement(tableId) {
        const tableSection = document.createElement('div');
        tableSection.className = 'table-section';
        tableSection.dataset.tableId = tableId;
        
        tableSection.innerHTML = `
            <div class="panel-trigger-zone"></div>
            
            <div class="side-panel">
                <div class="panel-header"><h3>Gestión de Mesa</h3></div>
                <div class="panel-content">
                    <div class="side-panel-main-controls">
                        <div class="data-item"><span class="data-icon">#</span><label>Mesa:</label><span contenteditable="true" class="value value-mesa-display"></span></div>
                        <div class="data-item">
                            <span class="data-icon"><i class="fa-solid fa-toggle-on"></i></span>
                            <label>Estado:</label>
                            <div class="status-control">
                                <div class="radio-inputs" data-table-id="${tableId}">
                                    <label class="radio"><input type="radio" name="status-${tableId}" value="${STATUS_ACTIVE}"><span class="name">Activa</span></label>
                                    <label class="radio"><input type="radio" name="status-${tableId}" value="${STATUS_PAUSED}"><span class="name">Pausa</span></label>
                                    <label class="radio"><input type="radio" name="status-${tableId}" value="${STATUS_INACTIVE}"><span class="name">Inactiva</span></label>
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
                        <div class="waitlist-table-container"><table class="waitlist-table"><tbody></tbody></table></div>
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
        `;
        mainContainer.appendChild(tableSection);
    },
    
    updatePublicTableUI(tableId, data) {
        const tableSection = document.querySelector(`[data-table-id="${tableId}"]`);
        if (!tableSection) return;
        
        const uiState = data.uiState || {};

        const updateText = (selector, value) => { 
            const el = tableSection.querySelector(selector); 
            if (el && el.textContent !== value) el.textContent = value ?? ''; 
        };
        
        updateText('.value-blinds-ontable', data.blinds);
        updateText('.value-buyin-ontable', data.buyinRange);
        updateText('.seats-value', 9 - (data.playerCount || 0));
        
        const mainTimerSpan = tableSection.querySelector('.timer-value');
        if (mainTimerSpan) {
            if (timers[tableId]) clearInterval(timers[tableId]);
            if (data.tableStatus === STATUS_ACTIVE && data.mainTimerStartTime?.toDate) {
                const mainTimerStartMillis = data.mainTimerStartTime.toDate().getTime();
                const mainTimerAccumulatedSecs = data.mainTimerSeconds || 0;
                timers[tableId] = setInterval(() => {
                    const now = Date.now();
                    const mainElapsedSecs = (now - mainTimerStartMillis) / 1000;
                    mainTimerSpan.textContent = formatTime(mainTimerAccumulatedSecs + mainElapsedSecs);
                }, 1000);
            } else {
                mainTimerSpan.textContent = formatTime(data.mainTimerSeconds || 0);
            }
        }
        
        tableSection.querySelectorAll('.seat').forEach(seat => {
            const seatNumber = seat.dataset.seat;
            const seatContent = seat.querySelector('.seat-content');
            if (seatNumber === "10") {
                const dealerImg = seat.querySelector('img');
                if (dealerImg) dealerImg.src = dealerImages[data.dealerImageIndex || 0];
                return;
            }
            const playerName = data[`seat_${seatNumber}_player`];
            if (playerName) {
                const avatarValue = data[`seat_${seatNumber}_avatar`];
                const imgData = playerImagesByName.find(i => i.name.toLowerCase() === (avatarValue || '').toLowerCase());
                const emoji = emojiIcons[currentEmojiIndex++ % emojiIcons.length];
                const newHTML = imgData ? `<img src="${imgData.url}" alt="${escapeHTML(avatarValue)}" class="player-avatar">` : `<span class="player-emoji">${emoji}</span>`;
                seatContent.innerHTML = newHTML;
                seat.classList.add('occupied');
            } else {
                if (seat.classList.contains('occupied')) {
                    seatContent.innerHTML = seatNumber;
                    seat.classList.remove('occupied');
                }
            }
        });

        const waitlistContainer = tableSection.querySelector('.public-waitlist-container');
        const waitlistUl = tableSection.querySelector('.public-waitlist');
        const waitlistPlayers = data.waitlistPlayers || [];

        if (waitlistContainer && waitlistUl) {
            if (uiState.isPanelOpen && waitlistPlayers.length > 0) {
                waitlistContainer.style.display = 'block';
                waitlistUl.innerHTML = waitlistPlayers.map(name => `<li>${escapeHTML(name)}</li>`).join('');
            } else {
                waitlistContainer.style.display = 'none';
            }
        }
    },

    updateTableUI(tableId, data, localTableState) {
        const tableSection = document.querySelector(`[data-table-id="${tableId}"]`);
        if (!tableSection) return;

        if (localTableState.timerInterval) clearInterval(localTableState.timerInterval);

        const updateText = (selector, value) => { 
            const el = tableSection.querySelector(selector); 
            if (el && el.textContent !== value) el.textContent = value ?? ''; 
        };
        
        updateText('.value-mesa-display', data.tableVisualNumber);
        updateText('.value-juego-ontable', data.gameType);
        updateText('.value-blinds-ontable', data.blinds);
        updateText('.value-buyin-ontable', data.buyinRange);
        updateText('.seats-value', 9 - (data.playerCount || 0));
        
        const waitlistCount = tableSection.querySelector('.waitlist-count');
        if (waitlistCount) updateText('.waitlist-count', `(${(data.waitlistPlayers?.length || 0)})`);
        
        const radioInputsContainer = tableSection.querySelector('.radio-inputs');
        const radioButtons = tableSection.querySelectorAll(`input[name="status-${tableId}"]`);
        
        if (radioInputsContainer) {
            radioInputsContainer.classList.remove('status-activo', 'status-pausa', 'status-inactivo');
        }

        radioButtons.forEach(radio => {
            if (radio.value === data.tableStatus) {
                radio.checked = true;
                if (radioInputsContainer) {
                    radioInputsContainer.classList.add(`status-${data.tableStatus}`);
                }
            }
        });

        const mainTimerSpan = tableSection.querySelector('.timer-value');
        if (mainTimerSpan) {
            if (data.tableStatus === STATUS_ACTIVE && data.mainTimerStartTime?.toDate) {
                const mainTimerStartMillis = data.mainTimerStartTime.toDate().getTime();
                const mainTimerAccumulatedSecs = data.mainTimerSeconds || 0;
                localTableState.timerInterval = setInterval(() => {
                    const now = Date.now();
                    const mainElapsedSecs = (now - mainTimerStartMillis) / 1000;
                    mainTimerSpan.textContent = formatTime(mainTimerAccumulatedSecs + mainElapsedSecs);
                }, 1000);
            } else {
                mainTimerSpan.textContent = formatTime(data.mainTimerSeconds || 0);
            }
        }
        
        // --- INICIO DE LA CORRECCIÓN ---
        tableSection.querySelectorAll('.seat').forEach(seat => {
            const seatNumber = seat.dataset.seat;
            const seatContent = seat.querySelector('.seat-content');

            if (seatNumber === "10") {
                const dealerImg = seat.querySelector('img');
                if (dealerImg) dealerImg.src = dealerImages[data.dealerImageIndex || 0];
                return;
            }
            
            const playerName = data[`seat_${seatNumber}_player`];
            if (playerName) {
                const avatarValue = data[`seat_${seatNumber}_avatar`];
                const imgData = playerImagesByName.find(i => i.name.toLowerCase() === (avatarValue || '').toLowerCase());
                const emoji = emojiIcons[currentEmojiIndex++ % emojiIcons.length];
                
                const avatarHTML = imgData 
                    ? `<img src="${imgData.url}" alt="${escapeHTML(avatarValue)}" class="player-avatar">`
                    : `<span class="player-emoji">${emoji}</span>`;

                // Se sobreescribe el contenido para garantizar que solo se muestre el avatar.
                seatContent.innerHTML = avatarHTML;
                
                seat.classList.add('occupied');
                seat.dataset.playerName = playerName;
            } else {
                if (seat.classList.contains('occupied')) {
                    seatContent.innerHTML = seatNumber;
                    seat.classList.remove('occupied');
                    delete seat.dataset.playerName;
                }
            }
        });
        // --- FIN DE LA CORRECCIÓN ---

        const tbody = tableSection.querySelector('.waitlist-table tbody');
        if (tbody) {
            tbody.innerHTML = '';
            (data.waitlistPlayers || []).forEach(name => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `<td contenteditable="true">${escapeHTML(name)}</td><td style="text-align: right;"><button class="waitlist-action-button seat-player" title="Sentar Jugador"><i class="fas fa-user-check"></i></button><button class="waitlist-action-button remove-player" title="Eliminar de Lista"><i class="fas fa-times"></i></button></td>`;
                tbody.appendChild(newRow);
            });
        }
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
        if(banner) {
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
