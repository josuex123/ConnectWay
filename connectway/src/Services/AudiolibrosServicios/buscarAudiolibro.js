import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { Audiobook } from './Audiolibro';

const db = getFirestore(app);

export const buscarAudiolibro = async (term) => {
    term = String(term)
    if (term === '' || term.length < 2) {
        return [];
    }

    const audiobooksRef = collection(db, 'Audiolibro');
    
    // Crear la consulta para buscar audiolibros por título
    const consulta = query(
        audiobooksRef,
        where('titulo', '>=', term),
        where('titulo', '<=', term + '\uf8ff')
    );

    try {
        const ejecutarConsulta = await getDocs(consulta);
        // Mapear los resultados a objetos Audioboo
        const resultado = ejecutarConsulta.docs.map((doc) => {
            const data = doc.data();
            return new Audiobook(
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
        });

        return resultado;

    } catch (error) {
        console.error('Error al buscar audiolibros:', error);
        throw error; // Lanza el error para manejo posterior
    }
};
