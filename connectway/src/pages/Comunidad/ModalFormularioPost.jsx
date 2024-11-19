import React, { useState } from 'react';
import '../../estilos/comunidad/ModalFormularioPost.css';
import { subirPost } from '../../Services/Post/SubirPost';
import { subirArchivoYObtenerUrl } from '../../Services/Post/SubirMultimediaPostObtenerUrl';

const ModalFormularioPost = ({ isOpen, onClose, onSubmit }) => {
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [archivo, setArchivo] = useState(null);

    const nombreUsuario = "Usuario Anónimo";

    const handleArchivoChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type.startsWith('image/') || file.type === 'video/mp4')) {
            setArchivo(file);
        } else {
            alert('Solo se permiten imágenes (png, jpg, gif) o videos (mp4).');
        }
    };

    const handleSubmit = async () => {
        if (titulo.trim() && contenido.trim()) {
            onSubmit({ titulo, contenido, archivo, nombreUsuario });
            try {
                // Subir el archivo (imagen o video)
                const archivoUrl = await subirArchivoYObtenerUrl(archivo);
                const correoUsuario = sessionStorage.getItem('correoUsuario');
                const usuarioNombre = sessionStorage.getItem('nombreUsuario');
    
                // Preparar el objeto del post
                const postContenido = {
                    titulo,
                    descripcion: contenido,
                    archivoUrl, // URL del archivo subido
                    correoUsuario: correoUsuario,
                    usuario: usuarioNombre,
                    fechaHoraPublicacion: new Date().toISOString(), // Agregar timestamp
                };
    
                // Guardar el post en Firestore
                await subirPost("inteligencia_emocional","6e0pWUPCFiP3pbFY4ERR" , postContenido);
    
                alert('Post agregado exitosamente.');
                onClose();
            } catch (error) {
                console.error('Error al agregar el post:', error);
                alert('Hubo un error al agregar el post. Por favor, intenta nuevamente.');
            }
        } else {
            alert('Por favor, completa todos los campos.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Crear Nueva Discusión</h2>
                <div className="usuario-info">
                    <span className="nombre-usuario">{nombreUsuario}</span>
                    <img
                        src="/ruta/icono-usuario.png"
                        alt="Usuario"
                        className="usuario-icono-derecha"
                    />
                </div>
                <form className="modal-form">
                    <div className="form-group">
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            placeholder="Título de Tema"
                            maxLength={100}
                            className="titulo-input"
                        />
                    </div>
                    <div className="form-group archivo-input">
                        <label htmlFor="archivo">
                            <div className="archivo-placeholder">📂 Subir archivo (png, jpg, gif, mp4)</div>
                        </label>
                        <input
                            id="archivo"
                            type="file"
                            onChange={handleArchivoChange}
                            accept="image/*,video/mp4"
                            hidden
                        />
                    </div>
                    <div className="form-group">
                        <textarea
                            value={contenido}
                            onChange={(e) => setContenido(e.target.value)}
                            placeholder="Escribe el contenido aquí"
                            rows={5}
                            className="contenido-textarea"
                        ></textarea>
                    </div>
                    <div className="modal-buttons">
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="button" className="confirm-button" onClick={handleSubmit}>
                            Publicar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalFormularioPost;
