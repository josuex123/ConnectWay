import React, { useState } from 'react';
import '../../estilos/comunidad/Post.css';
import defaultUser from '../../images/usuario.png'; // Imagen de usuario por defecto
import defaultImage from '../../images/postSinImagen.png'; // Imagen de post por defecto

const Post = ({ titulo, contenido, imagenUsuario, nombreUsuario, imagenPost }) => {
    const [mostrarTodo, setMostrarTodo] = useState(false);
    const limiteCaracteres = 200;

    const toggleContenido = () => {
        setMostrarTodo(!mostrarTodo);
    };

    const contenidoVisible = mostrarTodo
        ? contenido
        : contenido.length > limiteCaracteres
            ? contenido.slice(0, limiteCaracteres) + "..."
            : contenido;

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
                <p>
                    {contenidoVisible}
                    {contenido.length > limiteCaracteres && !mostrarTodo && (
                        <span 
                            onClick={toggleContenido} 
                            className="ver-mas-link"
                        > Ver más</span>
                    )}
                </p>
                {mostrarTodo && (
                    <span 
                        onClick={toggleContenido} 
                        className="ver-menos-link"
                    > Ver ménos</span>
                )}
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

export default Post;
