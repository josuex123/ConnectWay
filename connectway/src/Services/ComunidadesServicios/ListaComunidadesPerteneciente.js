import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const db = getFirestore(app);

export const listaComunidadesPerteneciente = async (userEmail) => {
  try {
    const comunidadesRef = collection(db, "Comunidades");
    const comunidadesSnapshot = await getDocs(comunidadesRef);

    const userSubcommunities = [];

    // Iterar sobre todas las comunidades
    for (const comunidad of comunidadesSnapshot.docs) {
      const comunidadId = comunidad.id;

      // Obtener las subcomunidades de la comunidad actual
      const subcomunidadesRef = collection(db, "Comunidades", comunidadId, "comunidades");
      const subcomunidadesSnapshot = await getDocs(subcomunidadesRef);

      for (const subcomunidad of subcomunidadesSnapshot.docs) {
        const subcomunidadId = subcomunidad.id;

        // Verificar si el usuario es miembro de la subcomunidad
        const miembrosRef = collection(
          db,
          "Comunidades",
          comunidadId,
          "comunidades",
          subcomunidadId,
          "miembros"
        );

        const miembroQuery = query(miembrosRef, where("__name__", "==", userEmail));
        const miembroSnapshot = await getDocs(miembroQuery);

        if (!miembroSnapshot.empty) {
          // Agregar el título de la subcomunidad si el usuario es miembro
          userSubcommunities.push(subcomunidad.data().titulo);
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
