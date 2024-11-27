

import React, { useState, useEffect } from 'react';
import '../../estilos/comunidad/ModalFormularioPost.css';
import { subirPost } from '../../Services/Post/SubirPost';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from '../../firebaseConfig';
import { obtenerNombreUsuario } from '../../Services/UsuarioServicios/NombreUsuarioPorIdDoc';

const storage = getStorage(app);

const handleFileUpload = async (file) => {
    const fileRef = ref(storage, `Post/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
};

const ModalFormularioPost = ({ isOpen, onClose, onSubmit }) => {
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [archivo, setArchivo] = useState(null);
    const [archivoPreview, setArchivoPreview] = useState(null);  
    const [nombreUsuario, setNombreUsuario] = useState('Usuario Anónimo');
    const [showTooltip, setShowTooltip] = useState(false); // Estado para mostrar el mensaje de advertencia

    useEffect(() => {
        const cargarNombreUsuario = async () => {
            const correoUsuario = sessionStorage.getItem('correoUsuario');
            if (correoUsuario) {
                try {
                    const nombre = await obtenerNombreUsuario(correoUsuario);
                    setNombreUsuario(nombre || 'Usuario Anónimo');
                } catch (error) {
                    console.error("Error al obtener el nombre del usuario:", error);
                }
            }
        };

        if (isOpen) {
            cargarNombreUsuario();
            setTitulo('');
            setContenido('');
            setArchivo(null);
            setArchivoPreview(null);
        }
    }, [isOpen]);

    const handleArchivoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const allowedFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
            if (!allowedFormats.includes(file.type)) {
                alert('Solo se permiten imágenes en formato PNG, JPG y GIF.');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                alert('Imágenes superiores a 10MB no están permitidas.');
                return;
            }
            setArchivo(file);
            setArchivoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        try {
            const archivoUrl = archivo ? await handleFileUpload(archivo) : null;

            const nuevoPost = {
                titulo,
                contenido,
                archivoUrl,
                correoUsuario: sessionStorage.getItem('correoUsuario'),
                usuario: nombreUsuario,
            };

            await subirPost(nuevoPost);
            onSubmit(nuevoPost);
            onClose();
        } catch (error) {
            console.error("Error al enviar el post:", error);
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
                        <div
                            className="tooltip-container"
                            onMouseEnter={() => setShowTooltip(true)} // Muestra el mensaje al pasar el cursor
                            onMouseLeave={() => setShowTooltip(false)} // Oculta el mensaje al salir el cursor
                        >
                            <input
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                placeholder="Título de Tema"
                                maxLength={100}
                                className="titulo-input"
                            />
                            {showTooltip && (
                                <div className="tooltip-box">
                                    El título no debe superar los 100 caracteres y solo se acepta números y caracteres alfabéticos.
                                </div>
                            )}
                        </div>
                        <span style={{ fontSize: '12px', color: '#888' }}>
                            {titulo.length}/100
                        </span>
                    </div>
                    <div className="form-group archivo-input">
                        {!archivoPreview && ( 
                            <label htmlFor="archivo">
                                <div className="archivo-placeholder">📂 Subir archivo (png, jpg, gif)</div>
                            </label>
                        )}
                        <input
                            id="archivo"
                            type="file"
                            onChange={handleArchivoChange}
                            accept="image/*"
                            hidden
                        />
                        {archivoPreview && (
                            <div
                                className="archivo-preview"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '10px',
                                    marginTop: '10px',
                                }}
                            >
                                <img
                                    src={archivoPreview}
                                    alt="Previsualización"
                                    style={{ width: '100px', borderRadius: '5px' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setArchivo(null);
                                        setArchivoPreview(null);
                                    }}
                                    className="eliminar-botton-post"
                                >
                                    Eliminar
                                </button>
                            </div>
                        )}
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
