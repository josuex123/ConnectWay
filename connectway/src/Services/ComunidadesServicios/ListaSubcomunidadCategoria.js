
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const db = getFirestore(app);

export const obtenerTitulosSubcomunidadesPorCategoria = async (userEmail, categoriaIdEspecifica) => {
  try {
    const subcomunidadesRef = collection(db, "Comunidades", categoriaIdEspecifica, "comunidades");
    const subcomunidadesSnapshot = await getDocs(subcomunidadesRef);

    const titulosSubcomunidades = [];

    for (const subcomunidad of subcomunidadesSnapshot.docs) {
      const subcomunidadId = subcomunidad.id;

      const miembrosRef = collection(
        db,
        "Comunidades",
        categoriaIdEspecifica,
        "comunidades",
        subcomunidadId,
        "miembros"
      );

      const miembroQuery = query(miembrosRef, where("__name__", "==", userEmail));
      const miembroSnapshot = await getDocs(miembroQuery);

      if (!miembroSnapshot.empty) {
        // Agregar solo el título de la subcomunidad
        titulosSubcomunidades.push(subcomunidad.data().titulo);
      }
    }

    return titulosSubcomunidades;
  } catch (error) {
    console.error("Error al obtener los títulos de las subcomunidades:", error);
    throw error;
  }
};
