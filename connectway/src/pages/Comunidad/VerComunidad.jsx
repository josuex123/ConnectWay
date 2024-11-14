import React from 'react';
import Navbar from '../../components/PaginaInicio/Navbar';
import Post from './Post';
import '../../estilos/comunidad/VerComunidad.css';

const VerComunidad = () => {
    // Ejemplo de datos de comunidades y posts que se podrían obtener de Firebase
    const comunidades = ["Comunidad A", "Comunidad B", "Comunidad C", "Comunidad D", "Comunidad E", "Comunidad B", "Comunidad C", "Comunidad D", "Comunidad E"];
    const post = {
        titulo: "Este e sun titulo de post demasiado largoq ue debe acortars eafsfewfjgetujfwjgejfgefgef",
        contenido: "Este es el contenido del post. Aquí puedes hablar sobre cualquier tema relacionado."+
        "Este es el contenido del post. Aquí puedes hablar sobre cualquier tema relacionado."+
        "Este es el contenido del post. Aquí puedes hablar sobre cualquier tema relacionado."+
        "Este es el contenido del post. Aquí puedes hablar sobre cualquier tema relacionado."+
        "Este es el contenido del post. Aquí puedes hablar sobre cualquier tema relacionado.",
        nombreUsuario: "Este es un nombre de usuario muy largo",
        imagenPost: null, // Usa la imagen por defecto
        imagenUsuario: null  // Usa la imagen por defecto
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
                        {/* Contenedor centrado para el título y la categoría */}
                        <div className="comunidad-header">
                            <h4>Aqui la categoria de la comunidad</h4>
                            <h1>Nombre de la comunidad</h1>
                        </div>

                        <div className="posts">
                            <Post
                                titulo={post.titulo}
                                contenido={post.contenido}
                                nombreUsuario={post.nombreUsuario}
                                imagenPost={post.imagenPost}
                                imagenUsuario={post.imagenUsuario}
                            />
                            <Post
                                titulo={"Este tit corto"}
                                contenido={"contenido corto"}
                                nombreUsuario={"corto"}
                                imagenPost={post.imagenPost}
                                imagenUsuario={post.imagenUsuario}
                            />
                            <Post
                                titulo={"Este tit cmediano no tna"}
                                contenido={"contenido corto afsjksdadljgaiefjvneijfv"}
                                nombreUsuario={"JeremiasVA"}
                                imagenPost={post.imagenPost}
                                imagenUsuario={post.imagenUsuario}
                            />
                            <Post
                                titulo={post.titulo}
                                contenido={post.contenido}
                                nombreUsuario={post.nombreUsuario}
                                imagenPost={post.imagenPost}
                                imagenUsuario={post.imagenUsuario}
                            />
                            <Post
                                titulo={post.titulo}
                                contenido={post.contenido}
                                nombreUsuario={post.nombreUsuario}
                                imagenPost={post.imagenPost}
                                imagenUsuario={post.imagenUsuario}
                            />
                            <Post
                                titulo={post.titulo}
                                contenido={post.contenido}
                                nombreUsuario={post.nombreUsuario}
                                imagenPost={post.imagenPost}
                                imagenUsuario={post.imagenUsuario}
                            />
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
