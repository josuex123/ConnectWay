import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../../firebaseConfig';

const storage = getStorage(app);

// Subir el archivo y obtener la URL
export const subirArchivoYObtenerUrl = async (archivo) => {
    try {
        // Crear referencia única basada en el timestamp y la extensión
        const extension = archivo.name.split('.').pop(); // Obtener la extensión
        const storageRef = ref(storage, `Post/${Date.now()}.${extension}`);

        // Subir el archivo
        await uploadBytes(storageRef, archivo);

        // Obtener la URL de descarga
        const url = await getDownloadURL(storageRef);
        return url; // Retorna la URL del archivo subido
    } catch (error) {
        console.error('Error al subir el archivo:', error);
        throw error; // Lanza el error para manejarlo en el lugar de llamada
    }
};
