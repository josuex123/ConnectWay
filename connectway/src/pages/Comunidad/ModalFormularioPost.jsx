
import React, { useState, useEffect } from 'react';
import '../../estilos/comunidad/ModalFormularioPost.css';
import { subirPost } from '../../Services/Post/SubirPost';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from '../../firebaseConfig';
import { obtenerNombreUsuario } from '../../Services/UsuarioServicios/NombreUsuarioPorIdDoc';
import ModalNotificacion from '../../components/Modal/ModalNotificacion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage,faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import defaultUser from "../../images/usuario.png";

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
    const [mensajeError, setMensajeError] = useState(''); 
    const [mensajeTituloError, setMensajeTituloError] = useState('');
    const [mensajeContenidoError, setMensajeContenidoError] = useState('');
    const [modalNotificacion, setModalNotificacion] = useState(false);
    const [showTooltipIcon1, setShowTooltipIcon1] = useState(false);

   
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
            setMensajeError(''); 
            setMensajeTituloError('');
            setMensajeContenidoError('');
        }
    }, [isOpen]);

    const handleTituloChange = (e) => {
        const value = e.target.value;
        if (value.length > 100) {
            setMensajeTituloError('El título no puede exceder los 100 caracteres.');
            return;
        }
        setTitulo(value);
        setMensajeTituloError(''); 
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
            const allowedFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']; 
            if (!allowedFormats.includes(file.type)) {
                setMensajeError('Solo se permiten imágenes en formato PNG, JPG y GIF.');
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // Cambiar el límite a 5MB
                setMensajeError('Imágenes superiores a 5MB no están permitidas.');
                return;
            }
            setArchivo(file);
            setArchivoPreview(URL.createObjectURL(file));
            setMensajeError(''); 
        }
    };

    const handleOverlayClick = () => {
        setMensajeError(''); 
    };

    const handleSubmit = async () => {
        if (!titulo.trim() || !contenido.trim()) {
            setModalNotificacion(true); 
            return;
        }
    
        try {
            const archivoUrl = archivo ? await handleFileUpload(archivo) : null;
    
            const nuevoPost = {
                titulo,
                contenido,
                archivoUrl,
                correoUsuario: sessionStorage.getItem('correoUsuario'),
                usuario: nombreUsuario,
                fechaHora: new Date().toISOString(),
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
                        src={defaultUser}
                        alt="Usuario"
                        className="usuario-icono-derecha"
                    />
                </div>
                {mensajeError && ( 
                    <div className="mensaje-error" style={{ color: 'red', marginBottom: '10px' }}>
                        {mensajeError}
                    </div>
                )}
                <form className="modal-form">
                    <div className="form-group">
                    <div>
                            <label htmlFor="nombre">
                    Título:<span style={{ color: 'red' }}>*</span>
                    </label>
                    </div>
                    <span style={{ fontSize: '12px', color: '#888' }}>
                    {titulo.length}/100
                    </span>
                        <input
                            type="text"
                            value={titulo}
                            onChange={handleTituloChange}
                            placeholder="Título de Tema"
                            className="titulo-input"
                        />
                        {mensajeTituloError && (
                            <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                                {mensajeTituloError}
                            </div>
                        )}
                    </div>
                    <div className="form-group archivo-input">
                        {!archivoPreview && ( 
                            <label htmlFor="archivo">
                                <div className="archivo-placeholder">📂 Subir archivo (png, jpg, gif)
                                <span 
                                    className="info-icon" 
                                    onMouseEnter={() => setShowTooltipIcon1(true)}
                                    onMouseLeave={() => setShowTooltipIcon1(false)}
                                >
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    {showTooltipIcon1 && (
                                        <div className="tooltip-box-icon">
                                            Solo se permiten imágenes en formato PNG, JPG y GIF. 
                                            El tamaño máximo es 5MB.
                                        </div>
                                    )}
                                </span>
                                </div>
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
                    <div>
                            <label htmlFor="nombre">
                    Contenido:<span style={{ color: 'red' }}>*</span>
                    </label>
                    </div>
                    <span style={{ fontSize: '12px', color: '#888' }}>
                        {contenido.length}/400
                    </span>
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
                        <button type="button" className="cancel-bot" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="button" className="submit-bot" onClick={handleSubmit}>
                            Publicar
                        </button>
                    </div>
                </form>
            </div>
            <ModalNotificacion
            isOpen={modalNotificacion}
            onClose={() => setModalNotificacion(false)}
            type="error"
            message="Es necesario Título y Contenido para publicar."
            iconClass="fa-times-circle" 
        />


        </div>
    );
};

export default ModalFormularioPost;
