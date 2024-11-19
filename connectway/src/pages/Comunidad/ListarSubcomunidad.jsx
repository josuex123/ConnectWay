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
  const [categoria, setCategoria] = useState('');

  console.log('El componente ListarSubComunidad se está montando.');
  console.log('Valor de idComunidad:', idComunidad);

  useEffect(() => {
    const obtenerDatosComunidad = async () => {
      try {
        const comunidadRef = doc(db, 'Comunidades', idComunidad);
        const comunidadSnap = await getDoc(comunidadRef);
  
        if (comunidadSnap.exists()) {
          const comunidadData = comunidadSnap.data();
          setTituloComunidad(comunidadData.titulo || 'Título no disponible');
        } else {
          console.error('La comunidad no existe.');
        }
      } catch (error) {
        console.error('Error al obtener la comunidad:', error);
      }
    };
  
    const obtenerSubcomunidades = async () => {
      try {
        // Aquí utilizamos el ID de la comunidad como categoría
        const categoriaActual = idComunidad;
        setCategoria(categoriaActual);
  
        const subcomunidadesRef = collection(db, 'Comunidades', categoriaActual, 'comunidades');
        const subcomunidadesSnap = await getDocs(subcomunidadesRef);
  
        if (subcomunidadesSnap.empty) {
          console.error('No se encontraron subcomunidades.');
          return;
        }
  
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
      obtenerDatosComunidad();
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
              categoria={categoria}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListarSubComunidad;
