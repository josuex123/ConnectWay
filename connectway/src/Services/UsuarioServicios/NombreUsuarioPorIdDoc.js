import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const db = getFirestore(app);

export const obtenerNombreUsuario = async (usuarioId) => {
  try {
    // Referencia al documento del usuario en la colección "Usuarios"
    const usuarioDocRef = doc(db, "Usuario", usuarioId);
    
    // Obtener los datos del documento
    const usuarioDoc = await getDoc(usuarioDocRef);
    
    if (usuarioDoc.exists()) {
      return usuarioDoc.data().usuario;
    } else {
      console.log("No existe un usuario con ese ID.");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el nombre del usuario:", error);
    throw error;
  }
};

