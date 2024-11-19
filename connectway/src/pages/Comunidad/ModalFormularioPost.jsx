import React, { useState } from 'react';
import '../../estilos/comunidad/ModalFormularioPost.css';
import { subirPost } from '../../Services/Post/SubirPost';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from '../../firebaseConfig'; // Asegúrate de que este archivo exporte tu configuración de Firebase.
import { obtenerNombreUsuario } from '../../Services/UsuarioServicios/NombreUsuarioPorIdDoc'; // Importa la función para obtener el nombre del usuario.

const storage = getStorage(app); // Instancia de Storage

const handleFileUpload = async (file) => {
    const fileRef = ref(storage, `Post/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
};

const ModalFormularioPost = ({ isOpen, onClose, onSubmit }) => {
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [archivo, setArchivo] = useState(null);

    const nombreUsuario = "Usuario Anónimo";

    const handleArchivoChange = (e) => {
        const file = e.target.files?.[0];
        if (file && (file.type.startsWith('image/') || file.type === 'video/mp4')) {
            setArchivo(file);
        } else {
            alert('Solo se permiten imágenes (png, jpg, gif) o videos (mp4).');
        }
    };

    const handleSubmit = async () => {
        try {
            const archivoUrl = archivo ? await handleFileUpload(archivo) : null;

            const nuevoPost = {
                titulo,
                contenido, // Cambié "descripcion" por "contenido", ya que "contenido" está definido.
                archivoUrl,
                correoUsuario: sessionStorage.getItem('correoUsuario'),
                usuario: await obtenerNombreUsuario(sessionStorage.getItem('correoUsuario')),
            };

            await subirPost(nuevoPost); // Suponiendo que esta función guarda el post.
            onSubmit(nuevoPost); // Callback proporcionado por el componente padre.
            onClose(); // Cierra el modal.
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
