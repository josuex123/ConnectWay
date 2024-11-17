import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebaseConfig'
import { getFirestore, doc, collection, getDocs, getDoc } from 'firebase/firestore';
import Navbar from '../../components/PaginaInicio/Navbar';
import ContenedorComunidad from '../../components/ContenedorComunidad/ContenedorComunidad';

const ListarSubComunidad = () => {
  const { idComunidad } = useParams();
  const [subcomunidades, setSubcomunidades] = useState([]);
  const [tituloComunidad, setTituloComunidad] = useState('');

  useEffect(() => {
    const obtenerSubcomunidades = async () => {
      try {

        const comunidadRef = doc(db, 'Comunidades', idComunidad);

        const comunidadSnap = await getDoc(comunidadRef);
        if (comunidadSnap.exists()) {
          setTituloComunidad(comunidadSnap.data().titulo || 'Comunidad');
        } else {
          console.error('La comunidad no existe');
          return;
        }

        const subcomunidadesRef = collection(comunidadRef, 'comunidades');
        const subcomunidadesSnap = await getDocs(subcomunidadesRef);

        const subcomunidadesData = subcomunidadesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSubcomunidades(subcomunidadesData);
      } catch (error) {
        console.error('Error al obtener las subcomunidades:', error);
      }
    };

    if (idComunidad) {
      obtenerSubcomunidades();
    }
  }, [idComunidad, db]);

  return (
    <div className="pagina-inicio">
      <Navbar />
      <div className="content-audiolibro">
        <h1 className="titulo-aud-reg">{tituloComunidad}</h1>
        <div className="d-flex justify-content-around flex-wrap" style={{ width: '80%' }}>
          {subcomunidades.map((sub) => (
            <ContenedorComunidad
              key={sub.id}
              titulo={sub.titulo}
              imgPortada={sub.imagenURL}
              descripcion={sub.descripcion}
              id={sub.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListarSubComunidad;
