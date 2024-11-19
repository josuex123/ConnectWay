import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const db = getFirestore(app);

export const subirPost = async (comunidadId, subcomunidadId, contenido) => {
    try {
        // Crear la referencia a la subcolección 'posts'
        const postsCollectionRef = collection(
            db,
            'Comunidades',
            comunidadId,
            'comunidades',
            subcomunidadId,
            'posts'
        );
        const contenidoConFecha = {
            ...contenido,
            fechaHoraPublicacion: serverTimestamp(),
        };

        const docRef = await addDoc(postsCollectionRef, contenidoConFecha);
        console.log('Post agregado con ID:', docRef.id);
    } catch (error) {
        console.error('Error al agregar el post:', error);
    }
};
