import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const db = getFirestore(app);

export const listaComunidadesPerteneciente = async (userEmail) => {
  try {
    const comunidadesRef = collection(db, "Comunidades");
    const categoriasSnapshot = await getDocs(comunidadesRef); // Obtiene las categorías

    const userSubcommunities = [];

    for (const categoriaDoc of categoriasSnapshot.docs) {
      const categoriaId = categoriaDoc.id; // Nombre de la categoría (por ejemplo: "inteligencia_emocional")
      const subcomunidadesRef = collection(db, "Comunidades", categoriaId, "comunidades");
      const subcomunidadesSnapshot = await getDocs(subcomunidadesRef);

      for (const subcomunidad of subcomunidadesSnapshot.docs) {
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
            idComunidad: categoriaId, // ID de la categoría
            idColeccion: subcomunidadId,
            titulo: subcomunidad.data().titulo,
            categoria: categoriaId, // Incluye la categoría aquí
          });
        }
      }
    }

    return userSubcommunities;
  } catch (error) {
    console.error("Error al obtener las subcomunidades:", error);
    throw error;
  }
};




/* 
    Retorna una lista con el título de las subcomunidades donde el usuario es miembro.
    
    // Ejemplo de uso:
    const correoUsuario = sessionStorage.getItem('correoUsuario'); // Obtener el correo del usuario logueado

    listaComunidadesPerteneciente(correoUsuario)
      .then((subcomunidades) => {
        console.log("Subcomunidades donde el usuario es miembro:", subcomunidades);
      })
      .catch((error) => {
        console.error("Error al obtener las subcomunidades:", error);
      });
*/
