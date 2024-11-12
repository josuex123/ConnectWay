import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const db = getFirestore(app);

export const editarEstadoReproduccion = async (idUsuario, idAudiolibro, estadoReproduccion, audioUrl) => {
    try {
        
        const collectionRef = collection(db, 'Usuario_EstadoReproduccion');

        const q = query(
            collectionRef,
            where('idUsuario', '==', idUsuario),
            where('idAudiolibro', '==', idAudiolibro)
        );
        
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const documento = querySnapshot.docs[0];
            const idDocumentoEncontrado = documento.id; 
            const docRef = doc(db, 'Usuario_EstadoReproduccion', idDocumentoEncontrado);
            await updateDoc(docRef, {
                estadoReproduccion: estadoReproduccion,
                urlAudiolibro: audioUrl
            });
            
            console.log('Documento actualizado correctamente');
        } else {
            console.log("No se encontró ningún documento con esa información");
            return null;
        }
    } catch (error) {
        console.error('Error al actualizar el estado de reproducción:', error);
    }
};
