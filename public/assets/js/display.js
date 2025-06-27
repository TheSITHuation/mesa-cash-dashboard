// /assets/js/display.js
// Lógica para la página pública de solo lectura (pantallas de la sala).

import { firestoreService } from '/src/services/firestoreService.js';
import { uiService } from '/src/services/uiService.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa los componentes de la UI
    uiService.init();

    // 2. Lee el parámetro 'table' de la URL para saber qué mesa mostrar
    const params = new URLSearchParams(window.location.search);
    const tableIdToShow = params.get('table');

    // Si no hay un ID de mesa en la URL, muestra un error y detiene la ejecución.
    if (!tableIdToShow) {
        document.body.innerHTML = '<h1>Error: No se ha especificado una mesa para mostrar.</h1>';
        return;
    }

    // 3. Crea la estructura HTML básica para la mesa y el modal de la ficha de jugador.
    uiService.createPublicTableElement(tableIdToShow);
    document.body.insertAdjacentHTML('beforeend', `
        <div id="player-card-modal-overlay" class="modal-overlay">
            <div class="player-card-modal">
                <div id="player-card-avatar" class="player-card-avatar"></div>
                <h3 id="player-card-name"></h3>
                <div id="player-card-details" class="player-card-details"></div>
            </div>
        </div>
    `);
    // Re-inicializamos uiService para que detecte el nuevo modal que acabamos de añadir.
    uiService.init();


    // 4. Escucha en tiempo real los cambios del documento de ESTA mesa específica en Firestore.
    firestoreService.onSpecificTableSnapshot(tableIdToShow, (doc) => {
        // Se asegura de que la mesa exista antes de intentar mostrar datos.
        if (doc.exists) {
            const tableData = doc.data();
            
            // Primero, actualiza la información base de la mesa (asientos, temporizador, lista de espera, etc.)
            uiService.updatePublicTableUI(tableIdToShow, tableData);

            // --- LÓGICA DE ESPEJO PARA LA FICHA DE JUGADOR ---
            const uiState = tableData.uiState || {};
            const playerNameToView = uiState.viewingPlayerName;

            if (playerNameToView) {
                // Si el admin está viendo una ficha, la mostramos aquí también.
                const playerData = tableData.players?.find(p => p.name === playerNameToView);
                const seatElement = document.querySelector(`.seat[data-seat="${uiState.viewingPlayerSeat}"] .seat-content`);
                const avatarHTML = seatElement ? seatElement.innerHTML : '';
                
                if (playerData) {
                    const seatData = { seconds: uiState.viewingPlayerTime };
                    uiService.showPlayerCard(playerData, seatData, avatarHTML);
                }
            } else {
                // Si el admin no está viendo ninguna ficha, nos aseguramos de que esté oculta.
                uiService.hidePlayerCard();
            }
            
        } else {
            // Si la mesa se elimina, se muestra un mensaje en la pantalla.
            document.body.innerHTML = `<h1>La mesa ya no está disponible.</h1>`;
        }
    });
});
