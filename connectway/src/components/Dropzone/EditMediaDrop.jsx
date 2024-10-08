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
    const [imageUrl, setImageUrl] = useState(initialImageUrl || '');
    const [audioUrl, setAudioUrl] = useState(initialAudioUrl || '');

    const closeModal = () => setShowModal(false);

    useEffect(() => {
        setImageUrl(initialImageUrl);
        setAudioUrl(initialAudioUrl);
    }, [initialImageUrl, initialAudioUrl]);

    const onDropImage = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        const imagePreviewUrl = URL.createObjectURL(file);
        setImageFiles([file]);
        setImageUrl(imagePreviewUrl); // Actualizar la URL de la imagen
        if (onImageChange) onImageChange(file); // Pasar el archivo de imagen actualizado
    }, [onImageChange]);

    const onDropAudio = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        const maxFileSize = 200 * 1024 * 1024; // 200 MB
        if (file.size > maxFileSize) {
            setAudioError('El archivo supera el tamaño máximo de 200MB.');
            setShowModal(true);
            return;
        }

        const audio = new Audio(URL.createObjectURL(file));
        audio.onloadedmetadata = () => {
            const duration = audio.duration / 60;
            if (duration < 15 || duration > 30) {
                setAudioError('La duración del audio debe estar entre 15 y 30 minutos.');
                setShowModal(true);
            } else {
                setAudioFiles([file]);
                setAudioUrl(URL.createObjectURL(file)); // Actualizar la URL del audio
                setAudioError(null);
                if (onAudioChange) onAudioChange(file); // Pasar el archivo de audio actualizado
            }
        };
    }, [onAudioChange]);

    const removeImageFile = () => {
        setImageFiles([]);
        setImageUrl('');
        if (onImageChange) onImageChange(null); // Limpiar el archivo de imagen
    };

    const removeAudioFile = () => {
        setAudioFiles([]);
        setAudioUrl('');
        if (onAudioChange) onAudioChange(null); // Limpiar el archivo de audio
    };

    const imageDropzone = useDropzone({
        onDrop: onDropImage,
        accept: { 'image/png': [], 'image/jpeg': [] },
        noClick: true,
    });

    const audioDropzone = useDropzone({
        onDrop: onDropAudio,
        accept: { 'audio/wav': [], 'audio/mpeg': [] },
        noClick: true,
    });

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Error</h3>
                        <p>{audioError}</p>
                        <button onClick={closeModal}>Cerrar</button>
                    </div>
                </div>
            )}

            {/* Subtítulo para la portada */}
            <div className="dropzone-container">
                <h3 className="dropzone-title">Imagen de la portada:</h3>
                <div {...imageDropzone.getRootProps()} className="dropzone">
                    {!imageUrl && imageFiles.length === 0 && (
                        <>
                            <div className="icon-container">
                                <FontAwesomeIcon icon={faImage} size="2x" className="icon" />
                            </div>
                            <button type="button" onClick={imageDropzone.open} className="select-button">
                                Sube un archivo
                            </button>
                            <p>ó deslizalo aquí</p>
                        </>
                    )}
                    <input {...imageDropzone.getInputProps()} style={{ display: 'none' }} />
                    {(imageUrl || imageFiles.length > 0) && (
                        <div className="uploaded-file">
                            <h4>Imagen Actual:</h4>
                            <img src={imageUrl} alt="Portada" width="100px" />
                            <button onClick={removeImageFile}>Eliminar</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Subtítulo para el audiolibro */}
            <div className="dropzone-container">
                <h3 className="dropzone-title">Audiolibro:</h3>
                <div {...audioDropzone.getRootProps()} className="dropzone">
                    {!audioUrl && audioFiles.length === 0 && (
                        <>
                            <div className="icon-container">
                                <FontAwesomeIcon icon={faMusic} size="2x" className="icon" />
                            </div>
                            <button type="button" onClick={audioDropzone.open} className="select-button">
                                Sube un archivo
                            </button>
                            <p>ó deslizalo aquí</p>
                        </>
                    )}
                    <input {...audioDropzone.getInputProps()} style={{ display: 'none' }} />
                    {(audioUrl || audioFiles.length > 0) && (
                        <div className="uploaded-file">
                            <h4>Audio Actual:</h4>
                            <audio controls src={audioUrl}></audio>
                            <button onClick={removeAudioFile}>Eliminar</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EditMediaDrop;
