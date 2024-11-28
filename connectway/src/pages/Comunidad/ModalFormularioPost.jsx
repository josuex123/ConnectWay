
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
    const [mensajeError, setMensajeError] = useState(''); // Para errores generales
    const [mensajeTituloError, setMensajeTituloError] = useState([]); // Para errores del título
    const [mensajeContenidoError, setMensajeContenidoError] = useState(''); // Para errores del contenido

    const validarAlfanumerico = (texto) => /^[a-zA-Z0-9\s]*$/.test(texto);

    
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
            setArchivoPreview(null); // Limpia la previsualización al abrir
            setMensajeError('');
            setMensajeTituloError([]);
            setMensajeContenidoError('');
        }
    }, [isOpen]);

    const handleTituloChange = (e) => {
        const value = e.target.value;
        const errores = [];

        // Validación de símbolos o emojis
        if (!validarAlfanumerico(value)) {
            errores.push('No se permite ese tipo de símbolos o emojis.');
        }

        // Validación de límite de caracteres
        if (value.length > 100) {
            errores.push('El título no puede exceder los 100 caracteres.');
        }

        // Si hay errores, muestra los mensajes y detiene la actualización del valor
        if (errores.length > 0) {
            setMensajeTituloError(errores);
            return; // No actualiza el estado
        }

        // Si pasa las validaciones, actualiza el estado y limpia los errores
        setTitulo(value);
        setMensajeTituloError([]);
    };

    const handleContenidoChange = (e) => {
        const value = e.target.value;
        if (value.length > 400) {
            setMensajeContenidoError('El contenido no puede exceder los 400 caracteres.');
            return;
        }
        setContenido(value);
        setMensajeContenidoError('');
    };

    const handleArchivoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const allowedFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']; // Formatos permitidos
            if (!allowedFormats.includes(file.type)) {
                setMensajeError('Solo se permiten imágenes en formato PNG, JPG y GIF.');
                return;
            }
            if (file.size > 10 * 1024 * 1024) { // Verifica si el archivo es mayor a 10 MB
                setMensajeError('Imágenes superiores a 10MB no están permitidas.');
                return;
            }
            setArchivo(file);
            setArchivoPreview(URL.createObjectURL(file));
            setMensajeError('');
        }
    };

    const handleOverlayClick = () => {
        setMensajeError(''); // Oculta el mensaje de error al hacer clic en cualquier parte
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
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
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
                            onChange={handleTituloChange}
                            placeholder="Título de Tema"
                            className="titulo-input"
                        />
                        {mensajeTituloError.length > 0 && (
                            <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                                {mensajeTituloError.map((error, index) => (
                                    <div key={index}>{error}</div>
                                ))}
                            </div>
                        )}
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
                            onChange={handleContenidoChange}
                            placeholder="Escribe el contenido aquí"
                            rows={5}
                            className="contenido-textarea"
                        ></textarea>
                        {mensajeContenidoError && (
                            <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                                {mensajeContenidoError}
                            </div>
                        )}
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
