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

    useEffect(() => {
        return () => {
            if (imageUrl) URL.revokeObjectURL(imageUrl);
            if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
    }, [imageUrl, audioUrl]);

    const onDropImage = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        const imagePreviewUrl = URL.createObjectURL(file);
        console.log("Ruta imagen local:", imagePreviewUrl);
        setImageFiles([file]);
        setImageUrl(imagePreviewUrl);
        if (onImageChange) onImageChange(file);
    }, [onImageChange]);

    const onDropAudio = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        const maxFileSize = 200 * 1024 * 1024; // 200 MB
        console.log("Archivo de audio seleccionado:", file);
    
        if (file.size > maxFileSize) {
            console.log("Error El archivo supera el tamaño máximo de 200MB.");
            setAudioError('El archivo supera el tamaño máximo de 200MB.');
            setShowModal(true);
            return;
        }
    
        const audioPreviewUrl = URL.createObjectURL(file);
        console.log("Ruta de audio local:", audioPreviewUrl);
    
        const audio = new Audio(audioPreviewUrl);
        console.log("Creando objeto Audio.");
    
        audio.onloadedmetadata = () => {
            console.log("Metadatos del audio cargados.");
            console.log("Duración del audio (en segundos):", audio.duration);
            const duration = audio.duration/60; 
            if (duration < 0 || duration > 30  ) { 
                console.log("Error: La duración del audio debe estar entre 15 y 30 minutos.");
                setAudioError('La duración del audio debe estar entre 15 y 30 minutos.');
                setShowModal(true);
            } else {
                console.log("Audio válido, actualizando estado.");
                setAudioFiles([file]);
                setAudioUrl(audioPreviewUrl); // Actualiza audioUrl
                setAudioError(null);
                if (onAudioChange) onAudioChange(file);
            }
        };
    
       audio.onerror = (e) => {
            console.error("Error al cargar el audio:", e);
            setAudioError('Error al cargar el archivo de audio.');
            setShowModal(true);
        };
    
        audio.oncanplaythrough = () => {
            console.log("Audio listo para reproducirse.");
        };
    
        // Asigna la URL directamente al elemento de audio si es posible
        setTimeout(() => {
            const audioElement = document.querySelector('audio');
            if (audioElement) {
                audioElement.src = audioPreviewUrl;
                console.log("Asignando URL al reproductor:", audioPreviewUrl);
                console.log(" URL al reproductor:", audioElement.src );
            }
        }, 200);
    
        audio.load(); // Asegúrate de cargar el audio
        console.log("Cargando audio...");
    }, [onAudioChange]);
    

    const removeImageFile = () => {
        setImageFiles([]);
        if (imageUrl) URL.revokeObjectURL(imageUrl);
        setImageUrl('');
        if (onImageChange) onImageChange(null);
    };

    const removeAudioFile = () => {
        setAudioFiles([]);
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl('');
        if (onAudioChange) onAudioChange(null);
    };

    const imageDropzone = useDropzone({
        onDrop: onDropImage,
        accept: { 'image/png': [], 'image/jpeg': [] },
    });

    const audioDropzone = useDropzone({
        onDrop: onDropAudio,
        accept: { 'audio/wav': [], 'audio/mpeg': [] },
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
                    <input {...imageDropzone.getInputProps()} style={{ display: 'none' }} />
                    {!imageUrl && imageFiles.length === 0 && (
                        <>
                            <div className="icon-container">
                                <FontAwesomeIcon icon={faImage} size="2x" className="icon" />
                            </div>
                            <p>Haz clic o arrastra un archivo aquí</p>
                        </>
                    )}
                    {(imageUrl || imageFiles.length > 0) && (
                        <div className="uploaded-file">
                            <div className="uploaded-portada">
                                <img src={imageUrl} alt="Portada" width="100px" />
                            </div>
                            <button
                                className="btn btn-outline-danger eliminar-botn"
                                onClick={removeImageFile}>Cambiar</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Subtítulo para el audiolibro */}
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
                            <div className="cont-eliminar">
                                <button className="btn btn-outline-danger eliminar-botn"
                                    onClick={removeAudioFile}>Cambiar</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EditMediaDrop;
