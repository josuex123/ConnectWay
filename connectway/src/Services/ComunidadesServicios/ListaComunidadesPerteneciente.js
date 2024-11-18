import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const db = getFirestore(app);

const listaComunidadesPerteneciente = async (comunidadId, userEmail) => {
  const subcomunidadesRef = collection(db, "Comunidades", comunidadId, "subcomunidades");
  const subcomunidadesSnapshot = await getDocs(subcomunidadesRef);

  const userSubcommunities = [];

  for (const subcomunidad of subcomunidadesSnapshot.docs) {
    const miembrosRef = collection(
      db,
      "Comunidades",
      comunidadId,
      "comunidades",
      subcomunidad.id,
      "miembros"
    );

    // Filtrar por el ID del miembro (correo del usuario)
    const miembroQuery = query(miembrosRef, where("__name__", "==", userEmail));
    const miembroSnapshot = await getDocs(miembroQuery);

    if (!miembroSnapshot.empty) {
      userSubcommunities.push(subcomunidad.data().titulo); // Cambia "titulo" al campo correcto
    }
  }

  return userSubcommunities;
};


