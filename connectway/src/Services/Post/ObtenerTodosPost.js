import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const db = getFirestore(app);

export const obtenerPostsOrdenados = async (comunidadId, subcomunidadId) => {
    try {
        // Referencia a la subcolección 'posts'
        const postsCollectionRef = collection(
            db,
            'Comunidades',
            comunidadId,
            'comunidades',
            subcomunidadId,
            'posts'
        );

        // Consulta ordenada por fechaHoraPublicacion de forma descendente (más recientes primero)
        const postsQuery = query(postsCollectionRef, orderBy('fechaHoraPublicacion', 'desc'));

        // Obtener los documentos de la consulta
        const querySnapshot = await getDocs(postsQuery);

        // Convertir los documentos en un array de objetos con los campos requeridos
        const posts = querySnapshot.docs.map((doc) => ({
            id: doc.id, // ID del documento
            archivoUrl: doc.data().archivoUrl || "", // URL del archivo
            correoUsuario: doc.data().correoUsuario || "", // Correo del usuario
            descripcion: doc.data().descripcion || "", // Descripción del post
            fechaHoraPublicacion: doc.data().fechaHoraPublicacion || "", // Fecha y hora de publicación
            titulo: doc.data().titulo || "", // Título del post
            usuario: doc.data().usuario || "" // Nombre del usuario
        }));

        return posts;
    } catch (error) {
        console.error('Error al obtener los posts ordenados:', error);
        throw error; // Lanza el error para manejarlo en el lugar donde se llama la función
    }
};
