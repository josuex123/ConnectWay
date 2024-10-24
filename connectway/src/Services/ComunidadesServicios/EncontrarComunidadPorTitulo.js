import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'; 
import { app } from '../../firebaseConfig';

const db = getFirestore(app);

export const EncontrarComunidadPorTitulo = async (tituloComunidad) => {
  try {
    const comunidadesRef = collection(db, 'Comunidades');

    const q = query(comunidadesRef, where('titulo', '==', tituloComunidad));  

    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      const comunidadId = docSnap.id;
      
      return comunidadId; 
    } else {
      console.log("No se encontró una comunidad con ese título");
      return null;  
    }
  } catch (error) {
    console.error("Error al encontrar la comunidad: ", error);
    return null;  
  }
};
