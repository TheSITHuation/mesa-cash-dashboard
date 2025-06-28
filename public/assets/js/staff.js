// /assets/js/staff.js

import { onAuthStateChanged, getCurrentRole, login, logout, ROLE_STAFF } from '/src/services/auth.js';
import { firestoreService } from '/src/services/firestoreService.js';
import { uiService } from '/src/services/uiService.js';
import { initSidePanelTriggers } from '/assets/js/ui/initSidePanelTriggers.js';
import { attachWaitlistHandlers } from '/assets/js/eventHandlers.js';

let isAppInitialized = false;
const mesasRenderizadas = new Set();
const RAKE_INTERVAL_SECONDS = 1800;

function renderTable(tableId) {
  if (mesasRenderizadas.has(tableId)) return;
  mesasRenderizadas.add(tableId);

  const section = uiService.createTableElement(tableId);
  if (!section) return;

  attachWaitlistHandlers(section);
  uiService.adjustLayoutForTables();
  initSidePanelTriggers();
}

function initializeAppLogic(user) {
  if (isAppInitialized) return;
  isAppInitialized = true;

  uiService.init();

  firestoreService.onTablesSnapshot((tables) => {
    tables.forEach(table => renderTable(table.id));
  });

  const addBtn = document.getElementById('addTableButton');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const newId = `mesa_${Date.now()}`;
      firestoreService.createTable(newId, { status: 'paused' });
    });
  }
}

onAuthStateChanged(async (user) => {
  if (user) {
    const role = await getCurrentRole(user);
    if (role === ROLE_STAFF) {
      document.getElementById('login-container').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
      initializeAppLogic(user);
    } else {
      logout();
    }
  }
});
// Escuchar clic en botón de login
document.getElementById('loginBtn')?.addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    await login(email, password);
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("Credenciales incorrectas o problema de conexión.");
  }
});
