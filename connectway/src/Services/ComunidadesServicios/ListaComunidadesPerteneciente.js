import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const db = getFirestore(app);

export const listaComunidadesPerteneciente = async (userEmail) => {
  try {
    const comunidadesRef = collection(db, "Comunidades");
    const comunidadesSnapshot = await getDocs(comunidadesRef);

    const userSubcommunities = [];

    // Mapeamos las categorías y preparamos las subcolecciones
    const categoriasPromises = comunidadesSnapshot.docs.map(async (categoriaDoc) => {
      const categoriaId = categoriaDoc.id;

      const subcomunidadesRef = collection(db, "Comunidades", categoriaId, "comunidades");
      const subcomunidadesSnapshot = await getDocs(subcomunidadesRef);

      // Recorremos las subcomunidades de cada categoría
      const subcomunidadesPromises = subcomunidadesSnapshot.docs.map(async (subcomunidad) => {
        const subcomunidadId = subcomunidad.id;

        const miembrosRef = collection(
          db,
          "Comunidades",
          categoriaId,
          "comunidades",
          subcomunidadId,
          "miembros"
        );

        const miembroQuery = query(miembrosRef, where("__name__", "==", userEmail));
        const miembroSnapshot = await getDocs(miembroQuery);

        if (!miembroSnapshot.empty) {
          userSubcommunities.push({
            idComunidad: categoriaId,
            idColeccion: subcomunidadId,
            titulo: subcomunidad.data().titulo,
            categoria: categoriaId,
          });
        }
      });

      await Promise.all(subcomunidadesPromises); // Espera a todas las subcomunidades de esta categoría
    });

    await Promise.all(categoriasPromises); // Espera a todas las categorías

    return userSubcommunities;
  } catch (error) {
    console.error("Error al obtener las subcomunidades:", error);
    throw error;
  }
};
