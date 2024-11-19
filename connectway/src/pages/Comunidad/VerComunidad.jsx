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

    const VerComunidad = () => {
        const location = useLocation();
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [comunidadData, setComunidadData] = useState(null);
        const [userComunidades, setUserComunidades] = useState([]); // Estado para las comunidades del usuario
        const categoria = location.state?.categoria;
    
        const categoriasMap = {
            inteligencia_emocional: 'Inteligencia Emocional',
            meditacion: 'Meditación',
            psicologia_de_parejas: 'Psicología de Parejas',
            salud_mental: 'Salud Mental',
        };
    
        const formatearCategoria = (categoria) => {
            return categoriasMap[categoria];
        };
    
        const [posts, setPosts] = useState([
            // Ejemplo de posts
            // ...
        ]);
    
        const handleIniciarDiscusion = () => {
            setIsModalOpen(true);
        };
    
        const handleCloseModal = () => {
            setIsModalOpen(false);
        };
    
        const handleCrearPost = async (nuevoPost) => {
        try {
            // Referencia a la colección `posts` dentro de la comunidad seleccionada
            const postsRef = collection(
                db,
                "Comunidades",
                idComunidad, // ID de la categoría
                "comunidades",
                idColeccion, // ID de la subcomunidad
                "posts"
            );

            // Agregar el nuevo post a Firebase
            await addDoc(postsRef, {
                ...nuevoPost,
                fechaHoraPublicacion: serverTimestamp(), // Fecha de Firebase
            });

            // Actualizar el estado local
            setPosts([nuevoPost, ...posts]);
        } catch (error) {
            console.error("Error al registrar el post en Firebase:", error);
        }
    };
    
       // const idColeccion = location.state?.idColeccion;
       // console.log('Datos id com:', idComunidad);
        
        
        const [idComunidad, setIdComunidad] = useState(null);
        const [idColeccion, setIdColeccion] = useState(null);
        useEffect(() => {
            const fetchData = async () => {
                const userEmail = sessionStorage.getItem('correoUsuario'); // Obtener el correo del usuario
        
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
                            <div className="comunidades-list">
                                <h3 className="text">Tus Comunidades:</h3>
                                <ul>
                                {userComunidades.length > 0 ? (
                                    userComunidades.map((comunidad, index) => (
                                        <li key={index} className="comunidad-item">
                                            <button
                                    onClick={async () => {
                                        setComunidadData(null); // Limpia los datos anteriores
                                        setIdComunidad(comunidad.idComunidad);
                                        setIdColeccion(comunidad.idColeccion);
                                    
                                        try {
                                            // Obtén los datos de la comunidad desde Firebase
                                            const docRef = doc(
                                                db,
                                                "Comunidades",
                                                comunidad.idComunidad,
                                                "comunidades",
                                                comunidad.idColeccion
                                            );
                                            const docSnap = await getDoc(docRef);
                                    
                                            if (docSnap.exists()) {
                                                // Configura los datos de la comunidad en el estado, incluyendo la categoría
                                                setComunidadData({
                                                    ...docSnap.data(),
                                                    categoria: comunidad.categoria, // Agrega la categoría directamente
                                                });
                                            } else {
                                                console.warn("No se encontró la comunidad seleccionada.");
                                            }
                                        } catch (error) {
                                            console.error("Error al obtener los datos de la comunidad:", error);
                                        }
                                    }}
                                    

                                            >
                                                {comunidad.titulo}
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <li>No te has unido a ninguna comunidad</li>
                                )}
                                </ul>

                            </div>
    
                            <div className="comunidad-content">
                            <div className="comunidad-header">
                            <h4>
                                                {(() => {
                        console.log('Datos de comunidadData:', comunidadData); // Depuración
                        return formatearCategoria(comunidadData?.categoria) || 'Categoría no disponible';
                    })()}
                            </h4>
                            {comunidadData ? (
                                <h1>{comunidadData.titulo}</h1>
                            ) : (
                                <h1>Cargando comunidad...</h1>
                            )}
                            </div>

    
                                <button
                                    className="button-comunidad"
                                    onClick={handleIniciarDiscusion}
                                >
                                    Iniciar Discusión
                                </button>
    
                                <div className="posts">
                                    {posts.map((post, index) => (
                                        <Post
                                            key={index}
                                            titulo={post.titulo}
                                            contenido={post.contenido}
                                            nombreUsuario={post.nombreUsuario}
                                            imagenPost={post.imagenPost}
                                            //imagenUsuario={post.imagenUsuario}
                                        />
                                    ))}
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