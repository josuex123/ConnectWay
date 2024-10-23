import { getFirestore, addDoc, collection,doc} from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { EncontrarComunidadPorTitulo } from './EncontrarComunidadPorTitulo';
import { subirImagenYObtenerUrl } from './SubirImgYobtenerUrl';

const db = getFirestore(app);
export const guardarSubComunidad= async (tituloComunidad, subcomunidad, archivoPortada) => {
  try {
      const comunidadId = await EncontrarComunidadPorTitulo(tituloComunidad);
      if (comunidadId == null) {
        console.error("No se encontró la comunidad con el título proporcionado");
        return;
      }
      const portadaImgUrl = await subirImagenYObtenerUrl(archivoPortada)
      const comunidadRef = doc(db, 'Comunidades',comunidadId);
      const subcomunidadRef = collection(comunidadRef, 'Subcomunidades');
      const documentoRef = await addDoc(subcomunidadRef, {
        titulo: subcomunidad.titulo,
        categoria: subcomunidad.categoria,
        descripcion: subcomunidad.descripcion,
        portadaUrl:portadaImgUrl
    });
  } catch (error) {
       console.error("Error al agregar el documento:", error);
  }
};

//Para usar debes pasarle el titulo de la categoria, un objeto Subcomunidad y un archivo tipo FILE del input