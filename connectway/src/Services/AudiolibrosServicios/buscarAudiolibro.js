import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { Audiobook } from './Audiolibro';

const db = getFirestore(app);

export const buscarAudiolibro = async (term) => {
    term = String(term).toLowerCase(); // Convertir a minúsculas para comparación
    if (term === '' || term.length < 3) {
        return [];
    }

    try {
        const querySnapshot = await getDocs(collection(db, 'Audiolibro'));
        const audiobooks = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const audiobook = new Audiobook(
                doc.id,
                data.titulo,
                data.autor,
                data.categoria,
                data.creadoEn,
                data.descripcion,
                data.duracion,
                data.imagenPortadaURL,
                data.archivoAudioURL,
                data.actualizadoEn
            );

            // Filtrar por el término en el título
            if (data.titulo.toLowerCase().includes(term) || data.autor.toLowerCase().includes(term)) {
                audiobooks.push(audiobook); 
            }
        });

        return audiobooks; // Retornar solo los audiolibros que coinciden

    } catch (error) {
        console.error('Error al buscar audiolibros:', error);
        throw error; 
    }
};
