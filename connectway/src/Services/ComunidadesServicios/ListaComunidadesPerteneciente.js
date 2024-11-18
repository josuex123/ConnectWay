import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const db = getFirestore(app);

export const listaComunidadesPerteneciente = async (comunidadId, userEmail) => {
  const subcomunidadesRef = collection(db, "Comunidades", comunidadId, "comunidades");
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

    const miembroQuery = query(miembrosRef, where("__name__", "==", userEmail));
    const miembroSnapshot = await getDocs(miembroQuery);

    if (!miembroSnapshot.empty) {
      userSubcommunities.push(subcomunidad.data().titulo); 
    }
  }

  return userSubcommunities;
};


/* 
        Retorna una lista con el titulo de las subcomunidades de las cuales es miembro
        Espera como parametros(idComunidad(inteligencia_emocial),correoElectronico(lo puedes sacar del session storage con:
        const correoUsuario = sessionStorage.getItem('correoUsuario');))
        
        // Ejemplo de uso
        await listaComunidadesPerteneciente(id, 'luizagamerinogustavo@gmail.com')
        .then((subcomunidades) => {
        console.log("Subcomunidades donde el usuario es miembro:", subcomunidades);
        })
        .catch((error) => {
        console.error("Error al obtener las subcomunidades:", error);
        });        
     
*/