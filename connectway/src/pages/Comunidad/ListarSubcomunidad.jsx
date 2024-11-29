import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { doc, collection, getDocs, getDoc } from 'firebase/firestore';
import Navbar from '../../components/PaginaInicio/Navbar';
import ContenedorSubComunidad from '../../components/ContenedorComunidad/ContenedorSubComunidad';
import ModalCargando from '../../components/Modal/ModalCargando';
import { obtenerTitulosSubcomunidadesPorCategoria } from '../../Services/ComunidadesServicios/ListaSubcomunidadCategoria';

const ListarSubComunidad = () => {
  const { idComunidad } = useParams();
  const [subcomunidades, setSubcomunidades] = useState([]);
  const [tituloComunidad, setTituloComunidad] = useState('Cargando...');
  const [categoria, setCategoria] = useState('');
  const [titulosUsuario, setTitulosUsuario] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Mostrar 8 elementos por página

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const comunidadRef = doc(db, 'Comunidades', idComunidad);
        const subcomunidadesRef = collection(db, 'Comunidades', idComunidad, 'comunidades');
        const correoUsuario = sessionStorage.getItem('correoUsuario');

        const [comunidadSnap, subcomunidadesSnap, titulos] = await Promise.all([
          getDoc(comunidadRef),
          getDocs(subcomunidadesRef),
          obtenerTitulosSubcomunidadesPorCategoria(correoUsuario, idComunidad),
        ]);

        if (comunidadSnap.exists()) {
          setTituloComunidad(comunidadSnap.data().titulo || 'Título no disponible');
        } else {
          console.error('La comunidad no existe.');
        }

        if (!subcomunidadesSnap.empty) {
          const subcomunidadesData = subcomunidadesSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          const subcomunidadesConEstado = subcomunidadesData.map((sub) => ({
            ...sub,
            estadoBoton: titulos.includes(sub.titulo) ? 'Ver Comunidad' : 'Unirse',
          }));

          setSubcomunidades(subcomunidadesConEstado);
        } else {
          console.error('No se encontraron subcomunidades.');
        }

        setTitulosUsuario(titulos);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      } finally {
        setLoading(false);
      }
    };

    if (idComunidad) {
      cargarDatos();
    }
  }, [idComunidad]);

  // Calcular las subcomunidades de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSubcomunidades = subcomunidades.slice(indexOfFirstItem, indexOfLastItem);

  // Manejo de páginas
  const handleNextPage = () => {
    if (currentPage < Math.ceil(subcomunidades.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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
            {currentSubcomunidades.map((sub) => (
              <ContenedorSubComunidad
                key={sub.id}
                titulo={sub.titulo}
                imgPortada={sub.imagenURL}
                descripcion={sub.descripcion}
                idColeccion={sub.id}
                id={idComunidad}
                categoria={categoria}
                estadoBoton={sub.estadoBoton}
              />
            ))}
          </div>
          {/* Botones de navegación */}
          <div className="pagination-buttons" style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="button-comunidad"
              style={{ marginRight: '10px', padding: '10px 20px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              Atrás
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === Math.ceil(subcomunidades.length / itemsPerPage)}
              className="button-comunidad"
              style={{ padding: '10px 20px', cursor: currentPage === Math.ceil(subcomunidades.length / itemsPerPage) ? 'not-allowed' : 'pointer' }}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListarSubComunidad;
