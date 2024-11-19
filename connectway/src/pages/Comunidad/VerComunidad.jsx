    import React, { useState, useEffect  } from 'react';
    import { useLocation } from 'react-router-dom';
    import Navbar from '../../components/PaginaInicio/Navbar';
    import { doc, getDoc } from 'firebase/firestore';
    import { db } from '../../firebaseConfig';
    import Post from './Post';
    import ModalFormularioPost from './ModalFormularioPost';
    import '../../estilos/comunidad/VerComunidad.css';

    const VerComunidad = () => {

        const location = useLocation();
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [comunidadData, setComunidadData] = useState(null);
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
            {
                titulo: "Este es un título de post demasiado largo que debe acortarse",
                contenido:
                    "Este es el contenido del post. Aquí puedes hablar sobre cualquier tema relacionado.",
                nombreUsuario: "Usuario Anónimo",
                imagenPost: null,
                imagenUsuario: null,
            },
            {
                titulo: "Este título corto",
                contenido: "Contenido corto",
                nombreUsuario: "Usuario Anónimo",
                imagenPost: null,
                imagenUsuario: null,
            },    

            {
                titulo: "Título mediano",
                contenido: "Contenido mediano con algo más de texto",
                nombreUsuario: "JeremiasVA",
                imagenPost: null,
                imagenUsuario: null,
            },
        ]);

        const comunidades = [
            "Comunidad A",
            "Comunidad B",
            "Comunidad C",
            "Comunidad D",
            "Comunidad E",
        ];

        const handleIniciarDiscusion = () => {
            setIsModalOpen(true);
        };

        const handleCloseModal = () => {
            setIsModalOpen(false);
        };

        const handleCrearPost = (nuevoPost) => {
            // Agrega el nuevo post al inicio de la lista
            setPosts([nuevoPost, ...posts]);
        };


        const idComunidad = location.state?.idComunidad; //categoria
        const idColeccion = location.state?.idColeccion;  // subcominidad
        console.log('Datos id com:', idComunidad);
        console.log('Datos id subcom:', idColeccion);

        useEffect(() => {
            const obtenerDatosComunidad = async () => {
                if (!idComunidad || !idColeccion) {
                    console.error('Faltan los identificadores de la comunidad o subcomunidad.');
                    return;
                }
        
                try {
                    const subComunidadRef = doc(db, 'Comunidades', idComunidad, 'comunidades', idColeccion);
                    const subComunidadSnap = await getDoc(subComunidadRef);
        
                    if (subComunidadSnap.exists()) {
                        const comunidad = subComunidadSnap.data();
                        setComunidadData({
                            titulo: comunidad.titulo || 'Título no disponible',
                            descripcion: comunidad.descripcion || 'Descripción no disponible',
                            imagenURL: comunidad.imagenURL || '',
                        });
                    } else {
                        console.error('La subcomunidad no existe en la base de datos.');
                    }
                } catch (error) {
                    console.error('Error al obtener la subcomunidad:', error);
                }
            };
        
            obtenerDatosComunidad();
        }, [idComunidad, idColeccion]);

        return (
            <>
            <div className="pagina-inicio">
                <Navbar />
                <div className="titulo-comunidad">
                    <div className="comunidad-page">
                        <div className="comunidades-list">
                            <h3 className="text">Tus Comunidades:</h3>
                            <ul>
                                {comunidades.map((comunidad, index) => (
                                    <li key={index} className="comunidad-item">
                                        <button>{comunidad}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="comunidad-content">
                            <div className="comunidad-header">
                                <h4>{formatearCategoria(categoria) || 'Categoría no disponible'}</h4>
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
                                        imagenUsuario={post.imagenUsuario}
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
