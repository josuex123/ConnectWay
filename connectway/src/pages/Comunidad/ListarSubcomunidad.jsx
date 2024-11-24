import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { doc, collection, getDocs, getDoc } from 'firebase/firestore';
import Navbar from '../../components/PaginaInicio/Navbar';
import ContenedorSubComunidad from '../../components/ContenedorComunidad/ContenedorSubComunidad';
import ModalCargando from '../../components/Modal/ModalCargando'; // Importamos el modal
import { obtenerTitulosSubcomunidadesPorCategoria } from '../../Services/ComunidadesServicios/ListaSubcomunidadCategoria';

const ListarSubComunidad = () => {
  const { idComunidad } = useParams();
  const [subcomunidades, setSubcomunidades] = useState([]);
  const [tituloComunidad, setTituloComunidad] = useState('Cargando...');
  const [categoria, setCategoria] = useState('');
  const [titulosUsuario, setTitulosUsuario] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para el modal de carga

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const comunidadRef = doc(db, 'Comunidades', idComunidad);
        const subcomunidadesRef = collection(db, 'Comunidades', idComunidad, 'comunidades');
        const correoUsuario = sessionStorage.getItem('correoUsuario');

        // Ejecutar las llamadas en paralelo
        const [comunidadSnap, subcomunidadesSnap, titulos] = await Promise.all([
          getDoc(comunidadRef),
          getDocs(subcomunidadesRef),
          obtenerTitulosSubcomunidadesPorCategoria(correoUsuario, idComunidad),
        ]);

        // Procesar datos de la comunidad
        if (comunidadSnap.exists()) {
          setTituloComunidad(comunidadSnap.data().titulo || 'Título no disponible');
        } else {
          console.error('La comunidad no existe.');
        }

        // Procesar subcomunidades
        if (!subcomunidadesSnap.empty) {
          const subcomunidadesData = subcomunidadesSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Agregar el estado del botón basado en los títulos del usuario
          const subcomunidadesConEstado = subcomunidadesData.map((sub) => ({
            ...sub,
            estadoBoton: titulos.includes(sub.titulo) ? 'Ver Comunidad' : 'Unirse',
          }));

          setSubcomunidades(subcomunidadesConEstado);
        } else {
          console.error('No se encontraron subcomunidades.');
        }

        // Guardar títulos de subcomunidades en los que el usuario es miembro
        setTitulosUsuario(titulos);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      } finally {
        setLoading(false); // Finalizar la carga
      }
    };

    if (idComunidad) {
      cargarDatos();
    }
  }, [idComunidad]);

  return (
    <div className="pagina-inicio">
      <Navbar />

      {/* Modal de carga */}
      <ModalCargando isOpen={loading} message="Estamos obteniendo la información de las subcomunidades." />

      {/* Contenido principal */}
      {!loading && (
        <div className="content-audiolibro">
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
                estadoBoton={sub.estadoBoton} // Pasamos el estado precalculado
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListarSubComunidad;
