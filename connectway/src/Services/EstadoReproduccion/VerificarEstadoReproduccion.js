import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'; 
import { app } from '../../firebaseConfig';

const db = getFirestore(app);

export const VerificarEstadoReporduccion = async (idAudiolibro, idUsuario) => {
    try {
        const documentRef = collection(db, 'Usuario_EstadoReproduccion');
        const q = query(
            documentRef, 
            where('idUsuario', '==', idUsuario), 
            where('idAudiolibro', '==', idAudiolibro)
        );
        
        // Ejecutar la consulta
        const querySnapshot = await getDocs(q);

        // Si se encuentra un documento
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0]; 
            console.log("Existe el documento solicitado")
            return doc.data().estadoReproduccion;
        } else {
            console.log("No existe el documento de la información");
            return null;
        }
    } catch (error) {
        console.error("Error al verificar el estado de reproducción:", error);
        return null;
    }
};
