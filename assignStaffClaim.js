// assignStaffClaim.js
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// 1️⃣ Inicializa Admin SDK con tu clave de servicio
const serviceAccount = JSON.parse(
  readFileSync(new URL('./serviceAccountKey.json', import.meta.url))
);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// 2️⃣ Reemplaza con el UID de tu usuario (lo ves en Auth → Users)
const STAFF_UID = 'UID_DE_TU_USUARIO';

async function assignStaff() {
  try {
    await admin.auth().setCustomUserClaims(STAFF_UID, { role: 'staff' });
    console.log(`✅ Claim 'staff' asignado a UID=${STAFF_UID}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error asignando claim:', err);
    process.exit(1);
  }
}

assignStaff();
