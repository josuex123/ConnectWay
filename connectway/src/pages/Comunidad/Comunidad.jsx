import React from 'react';
import Navbar from '../../components/PaginaInicio/Navbar';
import '../../estilos/comunidad/UnaComunidad.css';
import defaultUser from '../../images/usuario.png'; // Imagen de usuario por defecto
import defaultImage from '../../images/postSinImagen.png'; // Imagen de post por defecto

const Post = ({ titulo, contenido, imagenUsuario, nombreUsuario, imagenPost }) => {
    return (
        <div className="post-container">
            <div className="post-image">
                <img src={imagenPost || defaultImage} alt="Post" />
            </div>
            <div className="post-contenido">
                <div className="post-header">
                    <h2>{titulo}</h2>
                    <div className="user-info">
                        <img src={imagenUsuario || defaultUser} alt="Usuario" />
                        <span>{nombreUsuario}</span>
                    </div>
                </div>
                <p>{contenido}</p>
                <div className="post-footer">
                    <button className="icon-button">
                        <i className="fa fa-comment"></i> Comentarios
                    </button>
                    <button className="icon-button">
                        <i className="fa fa-heart"></i> Reacciones
                    </button>
                </div>
            </div>
        </div>
    );
};

const Comunidad = () => {
    // Ejemplo de datos de comunidades y posts que se podrían obtener de Firebase
    const comunidades = ["Comunidad A", "Comunidad B", "Comunidad C", "Comunidad D", "Comunidad E"];
    const post = {
        titulo: "Título de Post",
        contenido: "Este es el contenido del post. Aquí puedes hablar sobre cualquier tema relacionado.",
        nombreUsuario: "Usuario",
        imagenPost: null, // Usa la imagen por defecto
        imagenUsuario: null  // Usa la imagen por defecto
    };

    return (
        <>
            <Navbar />
            <div className="titulo-comunidad">
                {/* Sección de "Tus Comunidades" */}
                <h1>Inteligencia Emocional</h1>
                <h2>Comunidad A</h2>
                <div className="comunidad-page">
                    <div className="comunidades-list">
                        <h3>Tus Comunidades</h3>
                        <ul>
                            {comunidades.map((comunidad, index) => (
                                <li key={index} className="comunidad-item">
                                    <button>{comunidad}</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Sección principal de la comunidad y posts */}
                    <div className="comunidad-content">
                        <div className="posts">
                            <Post
                                titulo={post.titulo}
                                contenido={post.contenido}
                                nombreUsuario={post.nombreUsuario}
                                imagenPost={post.imagenPost}
                                imagenUsuario={post.imagenUsuario}
                            />
                            {/* Puedes agregar más componentes <Post /> aquí para más posts */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Comunidad;
