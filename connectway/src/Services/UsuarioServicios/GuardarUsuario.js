import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const db = getFirestore(app);

export const guardarUsuario = async (email, usuario) => {
  try {
    const usuarioDocRef = doc(db, 'Usuario', email);
    await setDoc(usuarioDocRef, {
      usuario: usuario,
    });
    console.log("Se creó con éxito el usuario");
    return true;
  } catch (error) {
    console.log("Error al guardar el usuario: " + error);
    return false;
  }
};
