import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { getFirestore, doc, collection, getDocs, getDoc } from 'firebase/firestore';
import Navbar from '../../components/PaginaInicio/Navbar';
import ContenedorSubComunidad from '../../components/ContenedorComunidad/ContenedorSubComunidad';

const ListarSubComunidad = () => {
  const { idComunidad } = useParams();
  const [subcomunidades, setSubcomunidades] = useState([]);
  const [tituloComunidad, setTituloComunidad] = useState('');
  console.log('El componente ListarSubComunidad se está montando.');
  console.log('Valor de idComunidad:', idComunidad);

  useEffect(() => {
    const obtenerSubcomunidades = async () => {
      try {
        const comunidadRef = doc(db, 'Comunidades', idComunidad);

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
        <h1 className="titulo-aud-reg">{tituloComunidad}</h1>
        

        <div className="d-flex justify-content-around flex-wrap" style={{ width: '100%' }}>
          {subcomunidades.map((sub) => (
            <ContenedorSubComunidad
              key={sub.id}
              titulo={sub.titulo}
              imgPortada={sub.imagenURL}
              descripcion={sub.descripcion}
              idColeccion={sub.id}
              id={idComunidad}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListarSubComunidad;
