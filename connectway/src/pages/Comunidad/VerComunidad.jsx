    import React, { useState, useEffect  } from 'react';
    import { useLocation } from 'react-router-dom';
    import Navbar from '../../components/PaginaInicio/Navbar';
    import { doc, getDoc } from 'firebase/firestore';
    import { db } from '../../firebaseConfig';
    import Post from './Post';
    import ModalFormularioPost from './ModalFormularioPost';
    import '../../estilos/comunidad/VerComunidad.css';
    import {listaComunidadesPerteneciente} from '../../Services/ComunidadesServicios/ListaComunidadesPerteneciente';
    import {collection, addDoc, serverTimestamp} from 'firebase/firestore';
    import {obtenerPostsOrdenados} from '../../Services/Post/ObtenerTodosPost';   
    import ModalCargando from '../../components/Modal/ModalCargando';

    const VerComunidad = () => {
        const location = useLocation();
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [comunidadData, setComunidadData] = useState(null);
        const [userComunidades, setUserComunidades] = useState([]); 
        const categoria = location.state?.categoria;
        const [posts, setPosts] = useState([]); 
        const [idComunidad, setIdComunidad] = useState(null);
        const [idColeccion, setIdColeccion] = useState(null);
        const [loading, setLoading] = useState(true); 
        const [selectedComunidad, setSelectedComunidad] = useState(null);
        const [selectedButton, setSelectedButton] = useState(null);


        const fetchPostsByComunidad = async (idComunidad, idColeccion) => {
            if (!idComunidad || !idColeccion) {
                console.warn("ID de comunidad o colección no proporcionados.");
                return;
            }
        
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
                console.error("Error al obtener los posts:", error);
            }
        };
        
        

        const categoriasMap = {
            inteligencia_emocional: 'Inteligencia Emocional',
            meditacion: 'Meditación',
            psicologia_de_parejas: 'Psicología de Parejas',
            salud_mental: 'Salud Mental',
        };
    
        const formatearCategoria = (categoria) => {
            return categoriasMap[categoria];
        };

    
        const handleIniciarDiscusion = () => {
            setIsModalOpen(true);
        };
    
        const handleCloseModal = () => {
            setIsModalOpen(false);
        };
    
        const handleCrearPost = async (nuevoPost) => {
            if (!idComunidad || !idColeccion) {
                console.error("Los IDs de comunidad o colección no están definidos.");
                return;
            }
        
            try {
                const postsRef = collection(
                    db,
                    "Comunidades",
                    idComunidad,
                    "comunidades",
                    idColeccion,
                    "posts"
                );
        
                await addDoc(postsRef, {
                    ...nuevoPost,
                    fechaHoraPublicacion: serverTimestamp(),
                });
                setPosts((prevPosts) => [nuevoPost, ...prevPosts]);
            } catch (error) {
                console.error("Error al registrar el post en Firebase:", error);
            }
        };
    
        useEffect(() => {
            const fetchData = async () => {
                const userEmail = sessionStorage.getItem('correoUsuario'); 
                //setLoading(true); //dejar de comentar estooooooooooooooooooooooo
                try {
                    const comunidades = await listaComunidadesPerteneciente(userEmail);
        
                    // Validar si se obtuvieron comunidades y mapearlas correctamente
                    if (comunidades && comunidades.length > 0) {
                        setUserComunidades(comunidades);
                    } else {
                        console.warn('El usuario no pertenece a ninguna comunidad.');
                    }
                } catch (error) {
                    console.error('Error al obtener las comunidades del usuario:', error);
                }finally{
                    setLoading(false);
                }
            };
        
            fetchData();
        }, []);
        
          
    
        return (
            <>
                <div className="pagina-inicio">
                    <Navbar />
                    <div className="titulo-comunidad">
                        <div className="comunidad-page">
                            <ModalCargando isOpen={loading} message="Cargando tus comunidades..." />
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
                            setIdComunidad(comunidad.idComunidad);
                            setIdColeccion(comunidad.idColeccion);

                            try {
                                const docRef = doc(
                                    db,
                                    "Comunidades",
                                    comunidad.idComunidad,
                                    "comunidades",
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
                                    console.warn("No se encontró la comunidad seleccionada.");
                                }
                            } catch (error) {
                                console.error("Error al obtener los datos de la comunidad:", error);
                            }
                        }}
                        className={`comunidad-item-btn ${
                            selectedButton === index ? "active" : ""
                        }`}
                    >
                        {comunidad.titulo}
                    </button>
                </li>
            ))
        ) : (
            <div className="empty-content">No te has unido a ninguna comunidad.</div>
        )}
    </ul>
    {/* Agregar un espaciador para asegurar tamaño fijo */}
    <div className="spacer"></div>
</div>


    
                            <div className="comunidad-content">
                            <div className="comunidad-header">
                            <h4>
                                                {(() => {
                        console.log('Datos de comunidadData:', comunidadData); // Depuración
                        return formatearCategoria(comunidadData?.categoria) || 'Categoría de la comunidad';
                    })()}
                            </h4>
                            {comunidadData ? (
                                <h1>{comunidadData.titulo}</h1>
                            ) : (
                                <h1>¡Selecciona una comunidad!</h1>
                            )}
                            </div>

    
                            <button
                                className="button-comunidad"
                                onClick={handleIniciarDiscusion}
                                disabled={!idComunidad} 
                            >
                                Iniciar Discusión
                            </button>

    
                            <div className="posts">
                                {Array.isArray(posts) && posts.length > 0 ? (
                                    posts.map((post, index) => (
                                        <Post
                                            key={post.id || index} 
                                            titulo={post.titulo || "Sin título"}
                                            contenido={post.contenido || "Sin contenido"}
                                            nombreUsuario={post.usuario || "Usuario desconocido"}
                                            imagenPost={post.archivoUrl || ""}
                                            comunidadId={idComunidad || ""}
                                            subComunidadId={idColeccion || ""}
                                            postId={post.id || ""}
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
                        onClose={handleCloseModal}
                        onSubmit={handleCrearPost}
                    />
                </div>
            </>
        );
    };
    
    export default VerComunidad;