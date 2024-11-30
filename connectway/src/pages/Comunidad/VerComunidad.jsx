import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/PaginaInicio/Navbar';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import Post from './Post';
import ModalFormularioPost from './ModalFormularioPost';
import '../../estilos/comunidad/VerComunidad.css';
import { listaComunidadesPerteneciente } from '../../Services/ComunidadesServicios/ListaComunidadesPerteneciente';
import { obtenerPostsOrdenados } from '../../Services/Post/ObtenerTodosPost';
import ModalCargando from '../../components/Modal/ModalCargando';

const VerComunidad = () => {
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [comunidadData, setComunidadData] = useState(null);
    const [userComunidades, setUserComunidades] = useState([]);
    const [posts, setPosts] = useState([]);
    const [idComunidad, setIdComunidad] = useState(null);
    const [idColeccion, setIdColeccion] = useState(null);
    const [loadingComunidades, setLoadingComunidades] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [selectedButton, setSelectedButton] = useState(null);

    const categoriasMap = {
        inteligencia_emocional: 'Inteligencia Emocional',
        meditacion: 'Meditación',
        psicologia_de_parejas: 'Psicología de Parejas',
        salud_mental: 'Salud Mental',
    };

    const formatearCategoria = (categoria) => categoriasMap[categoria];

    const fetchPostsByComunidad = async (idComunidad, idColeccion) => {
        if (!idComunidad || !idColeccion) return;

        setLoadingPosts(true);
        try {
            const posts = await obtenerPostsOrdenados(idComunidad, idColeccion);
            setPosts(
                posts.map((post) => ({
                    ...post,
                    fechaHora: post.fechaHoraPublicacion
                        ? post.fechaHoraPublicacion.toDate().toISOString()
                        : null,
                }))
            );
        } catch (error) {
            console.error('Error al obtener los posts:', error);
        } finally {
            setLoadingPosts(false);
        }
    };

    useEffect(() => {
        const fetchComunidades = async () => {
            const userEmail = sessionStorage.getItem('correoUsuario');
            setLoadingComunidades(true);

            try {
                const comunidades = await listaComunidadesPerteneciente(userEmail);
                if (comunidades && comunidades.length > 0) {
                    const comunidadesConImagenes = await Promise.all(
                        comunidades.map(async (comunidad) => {
                            try {
                                const docRef = doc(
                                    db,
                                    'Comunidades',
                                    comunidad.idComunidad,
                                    'comunidades',
                                    comunidad.idColeccion
                                );
                                const docSnap = await getDoc(docRef);

                                if (docSnap.exists()) {
                                    const imagenURL = docSnap.data()?.imagenURL?.trim() || 'https://via.placeholder.com/150?text=Sin+imagen';
                                    return { ...comunidad, imagenURL };
                                }
                            } catch (error) {
                                console.error(`Error al obtener imagen para comunidad ${comunidad.titulo}:`, error);
                            }
                            return { ...comunidad, imagenURL: 'https://via.placeholder.com/150?text=Sin+imagen' };
                        })
                    );

                    setUserComunidades(comunidadesConImagenes);
                } else {
                    console.warn('El usuario no pertenece a ninguna comunidad.');
                }
            } catch (error) {
                console.error('Error al obtener las comunidades del usuario:', error);
            } finally {
                setLoadingComunidades(false);
            }
        };

        fetchComunidades();
    }, []);

    return (
        <div className="pagina-inicio">
            <Navbar />
            <div className="titulo-comunidad">
                <div className="comunidad-page">
                    <ModalCargando isOpen={loadingComunidades} message="Cargando tus comunidades..." />
                    <div className="comunidades-list">
                        <h3 className="text">Tus Comunidades:</h3>
                        <ul>
                            {userComunidades.length > 0 ? (
                                userComunidades.map((comunidad, index) => (
                                    <li key={index} className="comunidad-item">
                                        <button
                                            onClick={async () => {
                                                setSelectedButton(index);
                                                setComunidadData(null);
                                                setPosts([]);
                                                setIdComunidad(comunidad.idComunidad);
                                                setIdColeccion(comunidad.idColeccion);

                                                try {
                                                    const docRef = doc(
                                                        db,
                                                        'Comunidades',
                                                        comunidad.idComunidad,
                                                        'comunidades',
                                                        comunidad.idColeccion
                                                    );
                                                    const docSnap = await getDoc(docRef);

                                                    if (docSnap.exists()) {
                                                        setComunidadData({
                                                            ...docSnap.data(),
                                                            categoria: comunidad.categoria,
                                                        });

                                                        await fetchPostsByComunidad(
                                                            comunidad.idComunidad,
                                                            comunidad.idColeccion
                                                        );
                                                    } else {
                                                        console.warn('No se encontró la comunidad seleccionada.');
                                                    }
                                                } catch (error) {
                                                    console.error('Error al obtener los datos de la comunidad:', error);
                                                }
                                            }}
                                            className={`comunidad-item-btn ${
                                                selectedButton === index ? 'active' : ''
                                            }`}
                                        >
                                            <img
                                                src={comunidad.imagenURL}
                                                alt="Imagen de comunidad"
                                                onError={(e) => (e.target.src = 'https://via.placeholder.com/150?text=Error')}
                                            />
                                            {comunidad.titulo}
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <div className="empty-content">No te has unido a ninguna comunidad.</div>
                            )}
                        </ul>
                    </div>

                    <div className="comunidad-content">
                        <ModalCargando isOpen={loadingPosts} message="Cargando los posts..." />
                        <div className="comunidad-header">
                            <h4>
                                {formatearCategoria(comunidadData?.categoria) || 'Categoría de la comunidad'}
                            </h4>
                            <h1>{comunidadData?.titulo || '¡Selecciona una comunidad!'}</h1>
                        </div>

                        <button
                            className="button-comunidad"
                            onClick={() => setIsModalOpen(true)}
                            disabled={!idComunidad}
                        >
                            Iniciar Discusión
                        </button>

                        <div className="posts">
                            {posts.length > 0 ? (
                                posts.map((post, index) => (
                                    <Post
                                        key={post.id || index}
                                        titulo={post.titulo || 'Sin título'}
                                        contenido={post.contenido || 'Sin contenido'}
                                        nombreUsuario={post.usuario || 'Usuario desconocido'}
                                        imagenPost={post.archivoUrl || ''}
                                        comunidadId={idComunidad || ''}
                                        subComunidadId={idColeccion || ''}
                                        postId={post.id || ''}
                                        fechaHora={post.fechaHora}
                                    />
                                ))
                            ) : (
                                <div className="empty">
                                    <p>No hay publicaciones en esta comunidad.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ModalFormularioPost
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={async (nuevoPost) => {
                    if (idComunidad && idColeccion) {
                        await handleCrearPost(nuevoPost);
                    }
                }}
            />
        </div>
    );
};

export default VerComunidad;
