import { getFirestore, collection, getDocs } from 'firebase/firestore';
import app from '../../firebaseConfig';
import { Audiobook } from './Audiolibro';
const db = getFirestore(app);

export const getAudiobooks = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'Audiolibro'));
        const audiobooks = [];
        querySnapshot.forEach((doc) => {
           
            const audiobook = new Audiobook(
                doc.id,
                doc.data().titulo,
                doc.data().autor,
                doc.data().categoria,
                doc.data().creadoEn,
                doc.data().descripcion,
                doc.data().duracion,
                doc.data().imagenPortadaURL,
                doc.data().archivoAudioURL,
                doc.data().actualizadoEn
            );
            audiobooks.push(audiobook); 
        });
        return audiobooks;
    } catch (error) {
        console.error('Error fetching audiobooks: ', error);
        throw error;
    }
};
