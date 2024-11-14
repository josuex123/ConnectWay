import React from 'react';
import Navbar from '../../components/PaginaInicio/Navbar';
import Post from './Post';
import '../../estilos/comunidad/VerComunidad.css';

const VerComunidad = () => {
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
                <h4>Aqui la categoria de la comunidad</h4>
                <h1>Nombre de la comunidad</h1>
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VerComunidad;
