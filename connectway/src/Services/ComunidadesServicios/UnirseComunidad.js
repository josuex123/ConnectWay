import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const db = getFirestore(app);

export const unirseComunidad = async (comunidadId, subcomunidadId, miembro, nombreUsuario) => {
    try {
        // Crear la referencia al documento
        const miembroDocRef = doc(
            db,
            'Comunidades',
            comunidadId,
            'comunidades',
            subcomunidadId,
            'miembros',
            miembro // ID personalizado del documento miembro
        );

        // Guardar el nombre de usuario como el único dato
        await setDoc(miembroDocRef, { usuario: nombreUsuario });

        console.log('Miembro añadido :', miembro);
    } catch (error) {
        console.error('Error al añadir miembro:', error);
    }
};
