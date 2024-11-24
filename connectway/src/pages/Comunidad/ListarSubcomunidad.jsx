import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { getFirestore, doc, collection, getDocs, getDoc } from 'firebase/firestore';
import Navbar from '../../components/PaginaInicio/Navbar';
import ContenedorSubComunidad from '../../components/ContenedorComunidad/ContenedorSubComunidad';
import {obtenerTitulosSubcomunidadesPorCategoria} from '../../Services/ComunidadesServicios/ListaSubcomunidadCategoria';

const ListarSubComunidad = () => {
  const { idComunidad } = useParams();
  const [subcomunidades, setSubcomunidades] = useState([]);
  const [tituloComunidad, setTituloComunidad] = useState('');
  const [categoria, setCategoria] = useState('');
  const [titulosUsuario, setTitulosUsuario] = useState([]); 

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

    const obtenerTitulos = async () => {
      try {
        // Suponiendo que el email del usuario ya está disponible
        const correoUsuario = sessionStorage.getItem('correoUsuario');
        console.log("idcomunnn ANTES DE BUSACAR"+idComunidad);
        const titulos = await obtenerTitulosSubcomunidadesPorCategoria(correoUsuario, idComunidad);
        setTitulosUsuario(titulos); // Guardamos los títulos de las subcomunidades a las que el usuario pertenece
      } catch (error) {
        console.error('Error al obtener los títulos de las subcomunidades:', error);
      }
    };
  
    if (idComunidad) {
      obtenerDatosComunidad();
      obtenerSubcomunidades();
      obtenerTitulos();
    }
  }, [idComunidad]);
  
  const obtenerEstadoBoton = (tituloSubcomunidad) => {
    // Comparamos el título de la subcomunidad con los títulos obtenidos
    return titulosUsuario.includes(tituloSubcomunidad) ? 'Ver Comunidad' : 'Unirse';
  };
  

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
              estadoBoton={obtenerEstadoBoton(sub.titulo)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListarSubComunidad;
