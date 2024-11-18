import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { getFirestore, doc, collection, getDocs, getDoc } from 'firebase/firestore';
import Navbar from '../../components/PaginaInicio/Navbar';
import ContenedorComunidad from '../../components/ContenedorComunidad/ContenedorComunidad';

const ListarSubComunidad = () => {
  const { idComunidad } = useParams();
  const [subcomunidades, setSubcomunidades] = useState([]);
  const [tituloComunidad, setTituloComunidad] = useState('');
  console.log('El componente ListarSubComunidad se está montando.');
  console.log('Valor de idComunidad:', idComunidad);

  useEffect(() => {
    const obtenerSubcomunidades = async () => {
      try {
        console.log('Obteniendo referencia al documento de la comunidad...');
        const comunidadRef = doc(db, 'Comunidades', idComunidad);

        console.log('Recuperando el documento de la comunidad...');
        const comunidadSnap = await getDoc(comunidadRef);
        
        if (comunidadSnap.exists()) {
          console.log('Documento de la comunidad encontrado:', comunidadSnap.data());
          setTituloComunidad(comunidadSnap.data().titulo || 'Comunidad');
        } else {
          console.error('La comunidad no existe');
          return;
        }

        console.log('Obteniendo subcolección "comunidades"...');
        const subcomunidadesRef = collection(comunidadRef, 'comunidades');
        const subcomunidadesSnap = await getDocs(subcomunidadesRef);

        console.log('Subcolección "comunidades" recuperada:', subcomunidadesSnap.docs);

        const subcomunidadesData = subcomunidadesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log('Datos de subcomunidades procesados:', subcomunidadesData);
        setSubcomunidades(subcomunidadesData);
      } catch (error) {
        console.error('Error al obtener las subcomunidades:', error);
      }
    };

    if (idComunidad) {
      console.log('ID de la comunidad:', idComunidad);
      obtenerSubcomunidades();
    }
  }, [idComunidad]);

  return (
    <div className="pagina-inicio">
      <Navbar />
      <div className="content-audiolibro" >
        <h1 className="titulo-aud-reg">x{tituloComunidad}</h1>
        

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
