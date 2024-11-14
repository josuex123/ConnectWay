import React, { useState } from 'react';
import Navbar from '../../components/PaginaInicio/Navbar';
import Post from './Post';
import ModalFormularioPost from './ModalFormularioPost';
import '../../estilos/comunidad/VerComunidad.css';

const VerComunidad = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    return (
        <>
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
                            <h1>Nombre de la Comunidad</h1>
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
        </>
    );
};

export default VerComunidad;
