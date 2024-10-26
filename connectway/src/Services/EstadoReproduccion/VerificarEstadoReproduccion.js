import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'; 
import { app } from '../../firebaseConfig';

const db = getFirestore(app);

export const VerificarEstadoReporduccion = async (idAudiolibro, idUsuario) => {
    try {
        // Referencia a la colección
        const documentRef = collection(db, 'Usuario_EstadoReproducion');
        
        // Consulta con where para traer el único documento que coincide
        const q = query(
            documentRef, 
            where('idUsuario', '==', idUsuario), 
            where('idAudiolibro', '==', idAudiolibro)
        );
        
        // Ejecutar la consulta
        const querySnapshot = await getDocs(q);

        // Si se encuentra un documento
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];  // Tomamos el primer documento, ya que esperamos solo uno
            return doc.data().estadoReproduccion;  // Retornamos el campo estadoReproduccion
        } else {
            console.log("No existe el documento de la información");
            return null;
        }
    } catch (error) {
        console.error("Error al verificar el estado de reproducción:", error);
        return null;
    }
};
