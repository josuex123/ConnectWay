import React from 'react'
import '../../estilos/comunidad/Post.css';
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

export default Post