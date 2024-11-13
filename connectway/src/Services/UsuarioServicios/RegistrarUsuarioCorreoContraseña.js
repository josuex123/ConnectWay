import { auth } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const registrarUsuario = async (email, contraseña) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, contraseña);
    const user = userCredential.user;
    console.log("Usuario registrado:", user);

    // Retornar un objeto con el uid del usuario
    return { uid: user.uid }; // Retornamos el UID
  } catch (error) {
    // Manejo de errores específicos
    switch (error.code) {
      case 'auth/email-already-in-use':
        return { error: "Este correo ya está registrado. Prueba con otro correo." }; // Retornamos el mensaje de error
      default:
        return { error: "Error al registrar el usuario: " + error.message }; // Retornamos el mensaje de error general
    }
  }
};

export default registrarUsuario;
