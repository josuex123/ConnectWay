import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../../firebaseConfig';

const storage = getStorage(app);

export const subirImagenYObtenerUrl = async (archivo) => {
  try {
    const storageRef = ref(storage, `PortadasSubcomunidad/${archivo.name}`);
    
   
    await uploadBytes(storageRef, archivo);
    
    // Obtener la URL de descarga
    const url = await getDownloadURL(storageRef);
    return url; // Retorna la URL de la imagen subida
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    throw error; // Lanza el error para manejarlo en el lugar de llamada
  }
};
// Archivo esta esperando un archivo tipo FILE del input del formulario