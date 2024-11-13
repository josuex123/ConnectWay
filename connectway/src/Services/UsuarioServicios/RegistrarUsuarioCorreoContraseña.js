import { auth } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const registrarUsuario = async (email, contraseña) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, contraseña);
    const user = userCredential.user;
    console.log("Usuario registrado:", user);
    return null; 
  } catch (error) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return "Este correo ya está registrado. Prueba con otro correo.";
        break;
      default:
        return "Error al registrar el usuario: " + error.message;
    }
  }
};

export default registrarUsuario;
