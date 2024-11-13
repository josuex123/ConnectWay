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

/* const handleRegister = async () => {
  const response = await registrarUsuario(email, contraseña);

  if (response.uid) {
    // El registro fue exitoso, podemos usar el uid
    console.log("Usuario registrado con UID:", response.uid);
  } else if (response.error) {
    // Hubo un error, mostramos el mensaje
    alert(response.error);
  }
};
 */
