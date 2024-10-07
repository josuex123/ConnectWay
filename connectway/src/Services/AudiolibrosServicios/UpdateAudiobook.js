import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const db = getFirestore(app);

export const updateAudiobook = async (id, updatedData) => {
    try {
        const docRef = doc(db, 'Audiolibro', id);
        await updateDoc(docRef, updatedData);
        console.log('Audiolibro actualizado correctamente en Firestore');
    } catch (error) {
        console.error('Error updating audiobook: ', error);
        throw error; // Propagar el error para manejo posterior
    }
};
