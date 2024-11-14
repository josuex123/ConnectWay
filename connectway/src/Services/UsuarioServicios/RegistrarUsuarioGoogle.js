import { auth } from "../../firebaseConfig";
import { signInWithPopup, GoogleAuthProvider, fetchSignInMethodsForEmail } from "firebase/auth";

const provider = new GoogleAuthProvider();

const registrarUsuarioGoogle = async () => {
  try {
    // Inicia el proceso de registro con Google
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Verifica si el correo ya está registrado
    const signInMethods = await fetchSignInMethodsForEmail(auth, user.email);

    if (signInMethods.length > 0) {
      throw new Error("Cuenta ya en uso");
    }

    // Si no está registrado, retorna el nombre completo y UID del usuario
    const fullName = user.displayName;
    const uid = user.uid;

    return { fullName, uid };
  } catch (error) {
    if (error.message === "Cuenta ya en uso") {
      console.error(error.message);
    } else {
      console.error("Error en el registro con Google:", error);
    }
    throw error;
  }
};

export default registrarUsuarioGoogle;
/* const manejarRegistroGoogle = async () => {
  try {
    const userData = await registrarUsuarioGoogle();
    console.log("Usuario registrado con Google:");
    console.log("Nombre Completo:", userData.fullName);
    console.log("UID:", userData.uid);

    // Aquí puedes realizar acciones adicionales, como redirigir al usuario o actualizar el estado de la aplicación
  } catch (error) {
    if (error.message === "Cuenta ya en uso") {
      alert("Esta cuenta de Google ya está registrada. Inicia sesión en su lugar.");
    } else {
      alert("Error durante el registro con Google. Inténtalo nuevamente.");
    }
  }
}; */