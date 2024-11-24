import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'; 
import { app } from '../../firebaseConfig';

const db = getFirestore(app);

export const verificarNombreUsuarioExistente = async (usuario) => {
  try {
    const usuarioRef = collection(db, 'Usuario');
    const q = query(usuarioRef, where('usuario', '==', usuario));  
    const querySnapshot = await getDocs(q);   
    if (querySnapshot.empty) {    
      return false;//Nombre de usuario no usado 
    } else {
      return true; //Nombre usuario usado 
    }
  } catch (error) {
    console.error("Error al encontrar el usuario: ", error);
    return null;  
  }
};
