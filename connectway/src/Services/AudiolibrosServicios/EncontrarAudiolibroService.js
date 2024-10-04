import { getFirestore, doc, getDoc } from 'firebase/firestore';
import {app} from '../../firebaseConfig';
import { Audiobook } from './Audiolibro';
const db = getFirestore(app);

export const getAudiobookId = async (id) => {
    try {
        const docRef = doc(db, 'Audiolibro', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const audiobook = new Audiobook(
                docSnap.id,
                docSnap.data().titulo,
                docSnap.data().autor,
                docSnap.data().categoria,
                docSnap.data().creadoEn,
                docSnap.data().descripcion,
                docSnap.data().duracion,
                docSnap.data().imagenPortadaURL,
                docSnap.data().archivoAudioURL,
                docSnap.data().actualizadoEn
            );
            return audiobook;
        } else {
            throw new Error('El audiolibro no existe.');
        }
    } catch (error) {
        console.error('Error fetching audiobook by ID: ', error);
        throw error;
    }
};
