const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Inicializa la app de admin una sola vez
admin.initializeApp();

/**
 * Cloud Function para asignar un rol de 'staff' a un usuario.
 * Se activa visitando una URL.
 * EJEMPLO DE USO:
 * https://us-central1-tu-project-id.cloudfunctions.net/addStaffRole?email=correo@ejemplo.com
 */
exports.addStaffRole = functions.https.onRequest(async (req, res) => {
  // 1. Obtener el email de la URL (query parameter)
  const email = req.query.email;
  if (!email) {
    return res.status(400).send("Por favor, proporciona un parámetro 'email' en la URL. Ejemplo: ?email=correo@ejemplo.com");
  }

  try {
    // 2. Buscar el usuario en Firebase Authentication por su email
    const user = await admin.auth().getUserByEmail(email);

    // 3. Asignar el custom claim 'role' con el valor 'staff'
    await admin.auth().setCustomUserClaims(user.uid, { role: "staff" });

    // 4. Enviar una respuesta de éxito
    return res.status(200).send(`¡Éxito! El usuario ${email} (UID: ${user.uid}) ahora tiene el rol de 'staff'. Por favor, cierra y vuelve a iniciar sesión en la aplicación.`);

  } catch (error) {
    console.error("Error asignando el rol de staff:", error);
    return res.status(500).send(`Error: ${error.message}. Asegúrate de que el email '${email}' esté registrado en Firebase Authentication.`);
  }
});