import React, { useState, useEffect } from 'react';
import Navbar from '../../components/PaginaInicio/Navbar';
import '../../estilos/comunidad/unirseComunidad.css';
import ContenedorComunidad from '../../components/ContenedorComunidad/ContenedorComunidad';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const UnirseComunidad = () => {
  const [comunidades, setComunidades] = useState([]); // Estado para las comunidades

  useEffect(() => {
    const fetchComunidades = async () => {
      try {
        const db = getFirestore(app);
        const comunidadesRef = collection(db, 'Comunidades');
        const querySnapshot = await getDocs(comunidadesRef);

        const comunidadesArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        // Limita el número de comunidades a 4
        setComunidades(comunidadesArray.slice(0, 4));
      } catch (error) {
        console.error('Error al recuperar las comunidades:', error);
      }
    };

    fetchComunidades();
  }, []);

  return (
    <div className="pagina-inicio">
      <Navbar />
      <div className="content-audiolibro">
        {comunidades.length > 0 && (
          <h1 className='titulo-aud-reg'>Comunidades</h1>
        )}
        <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex justify-content-between align-items-center flex-wrap" style={{ width: '100%' }}>
            {comunidades.map((comunidad) => (
              <ContenedorComunidad
                key={comunidad.id}
                titulo={comunidad.titulo}
                imgPortada={comunidad.imagenURL}
                descripcion={comunidad.descripcion}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnirseComunidad;
