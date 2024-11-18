import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import Navbar from '../../components/PaginaInicio/Navbar';
import Post from './Post';
import ModalFormularioPost from './ModalFormularioPost';
import '../../estilos/comunidad/VerComunidad.css';

const VerComunidad = () => {

    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const idComunidad = location.state?.idComunidad;
    const idColeccion = location.state?.idColeccion;
    const [comunidadData, setComunidadData] = useState(null);

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

    useEffect(() => {
        const obtenerDatosComunidad = async () => {
            if (!idComunidad) return;
            try {
                const subComunidadRef = doc(db, 'Comunidades', idColeccion, 'comunidades', idComunidad);
                const subComunidadSnap = await getDoc(subComunidadRef);

                if (subComunidadSnap.exists()) {
                    console.log('Datos de la subcomunidad:', subComunidadSnap.data());
                    setComunidadData(subComunidadSnap.data());
                } else {
                    console.error('La subcomunidad no existe');
                }
            } catch (error) {
                console.error('Error al obtener la subcomunidad:', error);
            }
        };

        obtenerDatosComunidad();
    }, [idComunidad]);

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
                            <h4>Categoría de la Comunidad</h4>
                            <h1>{comunidadData.titulo}</h1>
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
