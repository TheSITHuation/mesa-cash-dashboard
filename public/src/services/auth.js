// public/src/services/auth.js

/**
 * @file Servicio de autenticación para el panel de staff.
 * Usa el SDK “compat” de Firebase que se carga en admin.html.
 */

// ─── Constantes de Roles ─────────────────────────────────────────────────────

export const ROLE_STAFF  = 'staff';
export const ROLE_PLAYER = 'player';

// ─── Inicialización de Servicios Firebase (compat) ───────────────────────────

const auth = firebase.auth();
const db   = firebase.firestore();

// ─── Cache de roles para minimizar lecturas ─────────────────────────────────

const roleCache = {};

// ─── Funciones exportadas ────────────────────────────────────────────────────

/**
 * Observa cambios en el estado de autenticación.
 * @param {(user: import("firebase").User|null) => void} callback
 * @returns {firebase.Unsubscribe}
 */
export const onAuthStateChanged = (callback) =>
  auth.onAuthStateChanged(callback);


/**
 * Inicia sesión con email y contraseña.
 * @param {string} email
 * @param {string} pass
 * @returns {Promise<import("firebase").User>}
 * @throws {Error} Si faltan credenciales.
 */
export const login = async (email, pass) => {
  if (!email || !pass) {
    throw new Error('Email y contraseña son obligatorios');
  }
  const { user } = await auth.signInWithEmailAndPassword(email, pass);
  // Forzamos la renovación del token para obtener los custom claims actualizados
  await auth.currentUser.getIdToken(true);
  return user;
};


/**
 * Cierra la sesión del usuario actual.
 * @returns {Promise<void>}
 */
export const logout = () =>
  auth.signOut();


/**
 * Obtiene el rol del usuario almacenado en Firestore.
 * Utiliza cache en memoria para no repetir la lectura.
 * @param {import("firebase").User} user
 * @returns {Promise<'staff'|'player'>}
 */
export const getCurrentRole = async (user) => {
  if (!user) {
    return ROLE_PLAYER;
  }

  const uid = user.uid;
  if (roleCache[uid]) {
    return roleCache[uid];
  }

  try {
    const doc = await db.collection('users').doc(uid).get();
    const role = (doc.exists && doc.data().role) ? doc.data().role : ROLE_PLAYER;
    roleCache[uid] = role;
    console.log(`📖 Rol de ${user.email}: ${role}`);
    return role;
  } catch (error) {
    console.error('❌ Error obteniendo rol:', error);
    return ROLE_PLAYER;
  }
};
