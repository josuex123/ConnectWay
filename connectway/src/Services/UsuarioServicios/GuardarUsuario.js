import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const db = getFirestore(app);

export const guardarUsuario = async (uid, usuario, nombreCompleto) => {
  try {
    const usuarioDocRef = doc(db, 'Usuarios', uid);
    await setDoc(usuarioDocRef, {
      usuario: usuario,
      nombreCompleto: nombreCompleto,
    });

    console.log("Se creó con éxito el usuario");
    return uid;
  } catch (error) {
    console.log("Error al guardar el usuario: " + error);
  }
};
