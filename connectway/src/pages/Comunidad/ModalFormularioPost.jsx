import React, { useState } from 'react';
import '../../estilos/comunidad/ModalFormularioPost.css';

const ModalFormularioPost = ({ isOpen, onClose, onSubmit }) => {
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [archivo, setArchivo] = useState(null);

    const handleArchivoChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type.startsWith('image/') || file.type === 'video/mp4')) {
            setArchivo(file);
        } else {
            alert('Solo se permiten imágenes (png, jpg, gif) o videos (mp4).');
        }
    };

    const handleSubmit = () => {
        if (titulo.trim() && contenido.trim()) {
            onSubmit({ titulo, contenido, archivo });
            onClose();
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
                    <img src="/ruta/icono-usuario.png" alt="Usuario" className="usuario-icono" />
                    <span>Usuario</span>
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
