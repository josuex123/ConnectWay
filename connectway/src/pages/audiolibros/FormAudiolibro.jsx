import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './FormAudiolibro.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faMusic } from '@fortawesome/free-solid-svg-icons';

function FormAudiolibro() {
  const [imageFiles, setImageFiles] = useState([]);
  const [audioFiles, setAudioFiles] = useState([]);
  const [audioError, setAudioError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => setShowModal(false);

  const onDropImage = useCallback((acceptedFiles) => {
    setImageFiles(acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    })));
  }, []);

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
        setAudioError(null);
      }
    };
  }, []);

  const removeImageFile = () => setImageFiles([]);
  const removeAudioFile = () => setAudioFiles([]);

  const imageDropzone = useDropzone({
    onDrop: onDropImage,
    accept: { 'image/png': [], 'image/jpeg': [] },
    noClick: true
  });

  const audioDropzone = useDropzone({
    onDrop: onDropAudio,
    accept: { 'audio/wav': [], 'audio/mpeg': [] },
    noClick: true
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {/* Modal de error */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Error</h3>
            <p>{audioError}</p>
            <button onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Dropzone para imágenes */}
      <div {...imageDropzone.getRootProps()} className="dropzone">
        {imageFiles.length === 0 && (
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
        {imageFiles.length > 0 && (
          <div className="uploaded-file">
            <h4>Imagen Subida:</h4>
            {imageFiles.map((file) => (
              <div key={file.path}>
                <img src={file.preview} alt={file.name} width="100px" />
                <p>{file.name}</p>
                <button onClick={removeImageFile}>Eliminar</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dropzone para audios */}
      <div {...audioDropzone.getRootProps()} className="dropzone">
        {audioFiles.length === 0 && (
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
        {audioFiles.length > 0 && (
          <div className="uploaded-file">
            <h4>Audio Subido:</h4>
            {audioFiles.map((file) => (
              <div key={file.path}>
                <p>{file.name}</p>
                <button onClick={removeAudioFile}>Eliminar</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FormAudiolibro;
