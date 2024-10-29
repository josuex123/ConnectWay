import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './Drop.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faMusic } from '@fortawesome/free-solid-svg-icons';

function EditMediaDrop({ initialImageUrl, initialAudioUrl, onImageChange, onAudioChange }) {
    const [imageFiles, setImageFiles] = useState([]);
    const [audioFiles, setAudioFiles] = useState([]);
    const [audioError, setAudioError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [initialImage, setInitialImage] = useState(initialImageUrl || '');
    const [newImage, setNewImage] = useState(null); // Nueva imagen para previsualización
    const [audioUrl, setAudioUrl] = useState(initialAudioUrl || '');
    const closeModal = () => setShowModal(false);

    useEffect(() => {
        setInitialImage(initialImageUrl); // Actualiza la imagen inicial
        setAudioUrl(initialAudioUrl);
    }, [initialImageUrl, initialAudioUrl]);

    useEffect(() => {
        return () => {
            if (newImage && newImage !== initialImageUrl) {
                URL.revokeObjectURL(newImage);
            }
        };
    }, [newImage, initialImageUrl]);

    const handleImageUpload = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file && file.type.startsWith('image/')) {
            if (newImage) URL.revokeObjectURL(newImage);
            const previewUrl = URL.createObjectURL(file);
            setNewImage(previewUrl); // Actualiza la imagen de previsualización
            onImageChange(file);
        }
    }, [onImageChange, newImage]);

    const onDropAudio = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        const maxFileSize = 200 * 1024 * 1024; // 200 MB

        if (file.size > maxFileSize) {
            setAudioError('El archivo supera el tamaño máximo de 200MB.');
            setShowModal(true);
            return;
        }

        const audioPreviewUrl = URL.createObjectURL(file);
        const audio = new Audio(audioPreviewUrl);
        audio.onloadedmetadata = () => {
            const duration = audio.duration / 60;
            if (duration < 5 || duration > 30) {
                setAudioError('La duración del audio debe estar entre 5 y 30 minutos.');
                setShowModal(true);
            } else {
                setAudioFiles([file]);
                setAudioUrl(audioPreviewUrl);
                setAudioError(null);
                if (onAudioChange) onAudioChange(file);
            }
        };
        audio.onerror = () => {
            setAudioError('Error al cargar el archivo de audio.');
            setShowModal(true);
        };

        setTimeout(() => {
            const audioElement = document.querySelector('audio');
            if (audioElement) {
                audioElement.src = audioPreviewUrl;
            }
        }, 200);

        audio.load();
    }, [onAudioChange]);

    const removeImageFile = () => {
        setImageFiles([]);
        setNewImage(null); // Elimina la nueva imagen de previsualización
        if (onImageChange) onImageChange(null);
    };

    const removeAudioFile = () => {
        setAudioFiles([]);
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl('');
        if (onAudioChange) onAudioChange(null);
    };

    const imageDropzone = useDropzone({
        onDrop: handleImageUpload,
        accept: { 'image/png': [], 'image/jpeg': [] },
    });

    const audioDropzone = useDropzone({
        onDrop: onDropAudio,
        accept: { 'audio/wav': [], 'audio/mpeg': [] },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Agrega la lógica para manejar la subida de la imagen y el audio aquí
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'space-between' }}>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Error</h3>
                        <p>{audioError}</p>
                        <button onClick={closeModal}>Cerrar</button>
                    </div>
                </div>
            )}
            <div className="dropzone-container">
                <h3 className="dropzone-title">Imagen de la portada:</h3>
                <div {...imageDropzone.getRootProps()} className="dropzone">
                    <input {...imageDropzone.getInputProps()} style={{ display: 'none' }} />
                    {!newImage && !initialImage && imageFiles.length === 0 && (
                        <>
                            <div className="icon-container">
                                <FontAwesomeIcon icon={faImage} size="2x" className="icon" />
                            </div>
                            <p>Haz clic o arrastra un archivo aquí</p>
                        </>
                    )}
                    {(newImage || initialImage) && (
                        <div className="uploaded-file">
                            <div className="uploaded-portada">
                                <img
                                    src={newImage || initialImage}
                                    alt="Portada"
                                    width="100px"
                                    className="image-preview"
                                />
                            </div>
<<<<<<< HEAD
                            <button 
                            className="btn btn-outline-danger eliminar-botn"  
                            disabled={true}
                            onClick={removeImageFile}>Cambiar</button>
=======
                            <button
                                className="btn btn-outline-danger eliminar-botn"
                                onClick={removeImageFile}
                            >
                                Cambiar
                            </button>
>>>>>>> dev
                        </div>
                    )}
                </div>
            </div>
            <div className="dropzone-container">
                <h3 className="dropzone-title">Audiolibro:</h3>
                <div {...audioDropzone.getRootProps()} className="dropzone">
                    <input {...audioDropzone.getInputProps()} style={{ display: 'none' }} />
                    {!audioUrl && audioFiles.length === 0 && (
                        <>
                            <div className="icon-container">
                                <FontAwesomeIcon icon={faMusic} size="2x" className="icon" />
                            </div>
                            <p>Haz clic o arrastra un archivo aquí</p>
                        </>
                    )}
                    {(audioUrl || audioFiles.length > 0) && (
                        <div className="uploaded-file">
                            <audio controls src={audioUrl}></audio>
<<<<<<< HEAD
                            <div className="cont-eliminar">  
                                <button  className="btn btn-outline-danger eliminar-botn"
                                 onClick={removeAudioFile}
                                 disabled={true}>Cambiar</button>
                            </div>
=======
                            <button className="btn btn-outline-danger eliminar-botn" onClick={removeAudioFile}>
                                Cambiar
                            </button>
>>>>>>> dev
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
}

export default EditMediaDrop;
