import React from 'react';
import '../../estilos/comunidad/UnaComunidad.css';
import defaultUser from '../../images/usuario.png'; // user defecto
import defaultImage from '../../images/postSinImagen.png'; // post imagen defecto

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
  // Ejemplo de datos que se pueden obtener de Firebase
  const post = {
    titulo: "Título de Post",
    contenido: "Este es el contenido del post. Aquí puedes hablar sobre cualquier tema relacionado.",
    nombreUsuario: "Usuario",
    imagenPost: null, // Usa la imagen por defecto
    imagenUsuario: null  // Usa la imagen por defecto
  };

  return (
    <div className="comunidad">
      <h1>Inteligencia Emocional</h1>
      <h2>Comunidad A</h2>
      <div className="posts">
        <Post
          titulo={post.titulo}
          contenido={post.contenido}
          nombreUsuario={post.nombreUsuario}
          imagenPost={post.imagenPost}
          imagenUsuario={post.imagenUsuario}
        />
      </div>
    </div>
  );
};

export default Comunidad