// /src/services/auth.js
import { auth } from '/src/firebase-init.js';

export const ROLE_STAFF = 'staff';

export function onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
}

export async function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
}

export async function logout() {
    return auth.signOut();
}

export async function getCurrentRole(user) {
    try {
        const idTokenResult = await user.getIdTokenResult(true); // Forzar recarga de token
        return idTokenResult.claims.role || null;
    } catch (error) {
        console.error("Error obteniendo rol del usuario:", error);
        return null;
    }
}
