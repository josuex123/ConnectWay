import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const db = getFirestore(app);

export const editarEstadoReproduccion = async (idUsuario, idAudiolibro, estadoReproduccion, audioUrl) => {
    try {
        // Crear una referencia a la colección
        const collectionRef = collection(db, 'Usuario_EstadoReproducion');
        
        // Consulta con 'where' para traer el documento que coincide con idUsuario e idAudiolibro
        const q = query(
            collectionRef,
            where('idUsuario', '==', idUsuario),
            where('idAudiolibro', '==', idAudiolibro)
        );
        
        // Ejecutar la consulta
        const querySnapshot = await getDocs(q);

        // Si se encuentra un documento
        if (!querySnapshot.empty) {
            // Obtener el primer documento de la consulta
            const documento = querySnapshot.docs[0];
            const idDocumentoEncontrado = documento.id; // Guardar el id del documento encontrado
            
            // Referencia al documento
            const docRef = doc(db, 'Usuario_EstadoReproducion', idDocumentoEncontrado);
            
            // Actualizar el documento con los nuevos datos
            await updateDoc(docRef, {
                estadoReproduccion: estadoReproduccion,
                audioUrl: audioUrl
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
