import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const db = getFirestore(app);

export const obtenerPostsOrdenados = async (comunidadId, subcomunidadId) => {
    try {
        const postsCollectionRef = collection(
            db,
            'Comunidades',
            comunidadId,
            'comunidades',
            subcomunidadId,
            'posts'
        );

        const postsQuery = query(postsCollectionRef, orderBy('fechaHoraPublicacion', 'desc'));
        const querySnapshot = await getDocs(postsQuery);
        const posts = querySnapshot.docs.map((doc) => ({
            id: doc.id, 
            archivoUrl: doc.data().archivoUrl || "", 
            correoUsuario: doc.data().correoUsuario || "", 
            contenido: doc.data().contenido || "", 
            fechaHoraPublicacion: doc.data().fechaHoraPublicacion || "", 
            titulo: doc.data().titulo || "", 
            usuario: doc.data().usuario || "" 
        }));

        return posts;
    } catch (error) {
        console.error('Error al obtener los posts ordenados:', error);
        throw error; 
    }
};
