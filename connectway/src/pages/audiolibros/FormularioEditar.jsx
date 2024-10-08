import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updateAudiobook } from '../../Services/AudiolibrosServicios/UpdateAudiobook';
import '../../estilos/Audiolibros/FormularioEditar/Formulario.css';
import EditMediaDrop from '../../components/Dropzone/EditMediaDrop'; // Componente para manejar imágenes y audio
import ModalNotificacion from '../../components/Modal/ModalNotificacion';
import ModalConfirmacion from '../../components/Modal/ModalConfirmacion';

const AudiobookEdit = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { audiobook } = location.state || {};

    const [titulo, setTitulo] = useState('');
    const [autor, setAutor] = useState('');
    const [categoria, setCategoria] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imagenUrl, setImagenUrl] = useState(''); // Campo para imagen
    const [audioUrl, setAudioUrl] = useState('');   // Campo para el audio

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isModalNotificacionOpen, setIsModalNotificacionOpen] = useState(false);
    const [notificationType, setNotificationType] = useState('success');
    const [notificationMessage, setNotificationMessage] = useState('');

    const storage = getStorage();

    // Cargamos los valores del audiolibro cuando el componente se monta
    useEffect(() => {
        if (audiobook) {
            setTitulo(audiobook.titulo || '');
            setAutor(audiobook.autor || '');
            setCategoria(audiobook.categoria || '');
            setDescripcion(audiobook.descripcion || '');
            setImagenUrl(audiobook.imagenPortadaURL || ''); // Cargar imagen existente
            setAudioUrl(audiobook.archivoAudioURL|| '');   // Cargar archivo de audio existente
        }
    }, [audiobook]);

    // Función para subir la imagen a Firebase Storage
    const uploadImageToStorage = async (file) => {
        if (!file) return null;
        const storageRef = ref(storage, `Portadas/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    console.error('Error subiendo imagen:', error);
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadURL);
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    };

    // Función para subir el archivo de audio a Firebase Storage
    const uploadAudioToStorage = async (file) => {
        if (!file) return null;
        const storageRef = ref(storage, `Audios/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    console.error('Error subiendo archivo de audio:', error);
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadURL);
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    };

    const handleSubmit = async () => {
        let imageUrlToSave = imagenUrl;
        let audioUrlToSave = audioUrl;

        // Si es un archivo nuevo, lo subimos
        if (typeof imagenUrl === 'object') {
            imageUrlToSave = await uploadImageToStorage(imagenUrl);
        }

        if (typeof audioUrl === 'object') {
            audioUrlToSave = await uploadAudioToStorage(audioUrl);
        }

        const updatedData = {
            titulo,
            autor,
            categoria,
            descripcion,
            imagenPortadaURL: imageUrlToSave,
            archivoAudioURL: audioUrlToSave, // Guardamos la nueva URL o la URL existente del audio
        };

        try {
            await updateAudiobook(audiobook.id, updatedData);
            showModalNotificacion('success', 'El audiolibro ha sido actualizado exitosamente.');
            navigate('/Audiolibros/registrados');
        } catch (error) {
            console.error('Error al actualizar el audiolibro: ', error);
            showModalNotificacion('error', 'Hubo un error al actualizar el audiolibro.');
        }
    };

    const showModalNotificacion = (type, message) => {
        setNotificationType(type);
        setNotificationMessage(message);
        setIsModalNotificacionOpen(true);
    };

    const closeModalNotificacion = () => {
        setIsModalNotificacionOpen(false);
    };

    const openConfirmModal = () => {
        setIsConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        setIsConfirmModalOpen(false);
    };

    return (
        <div className="audiobook-edit-page">
            <h1>Editar Audiolibro</h1>
            <form className="form-container">
                <label htmlFor="titulo">Título:</label>
                <input
                    type="text"
                    id="titulo"
                    placeholder="Título"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                />

                <label htmlFor="autor">Autor:</label>
                <input
                    type="text"
                    id="autor"
                    placeholder="Autor"
                    value={autor}
                    onChange={(e) => setAutor(e.target.value)}
                />

                <label htmlFor="categoria">Categoría:</label>
                <select
                    id="categoria"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                >
                    <option value="">Elegir categoría</option>
                    <option value="meditacion">Meditación</option>
                    <option value="inteligencia_emocional">Inteligencia Emocional</option>
                    <option value="salud_mental">Salud Mental</option>
                    <option value="psicologia_parejas">Psicología de Parejas</option>
                </select>

                <label htmlFor="descripcion">Descripción:</label>
                <textarea
                    id="descripcion"
                    placeholder="Descripción"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />

                <EditMediaDrop
                    initialImageUrl={imagenUrl}   // Mostrar la imagen actual o subir una nueva
                    initialAudioUrl={audioUrl}    // Mostrar el audio actual o subir uno nuevo
                    onImageChange={setImagenUrl}  // Callback para cuando cambie la imagen
                    onAudioChange={setAudioUrl}   // Callback para cuando cambie el audio
                />

                <div className="form-buttons">
                    <button type="button" onClick={openConfirmModal}>Guardar cambios</button>
                    <button type="button" onClick={() => window.history.back()}>Cancelar</button>
                </div>
            </form>

            <ModalNotificacion
                isOpen={isModalNotificacionOpen}
                onClose={closeModalNotificacion}
                type={notificationType}
                message={notificationMessage}
                iconClass={notificationType === 'success' ? 'fa fa-check' : 'fa fa-exclamation'}
            />

            <ModalConfirmacion
                isOpen={isConfirmModalOpen}
                onClose={closeConfirmModal}
                onConfirm={handleSubmit}
                title="Confirmar"
                description="¿Estás seguro de que deseas guardar los cambios?"
                iconClass="fa fa-save"
            />
        </div>
    );
};

export default AudiobookEdit;
