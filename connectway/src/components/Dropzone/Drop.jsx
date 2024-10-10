import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './Drop.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faMusic, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

function Drop() {
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
      {/* Modal de Bootstrap */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <FontAwesomeIcon icon={faExclamationCircle} size="4x" style={{ color: '#ffc107' }} />
          <p className="mt-3">{audioError}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Zona de subida de imagen */}
      <div className="dropzone-container">
        <h3 className="dropzone-title">Subir portada:</h3>
        <div {...imageDropzone.getRootProps()} className="dropzone">
          {imageFiles.length === 0 && (
            <>
              <div className="icon-container">
                <FontAwesomeIcon icon={faImage} size="2x" className="icon" />
              </div>
              <button type="select-button" onClick={imageDropzone.open} className="select-button">
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
      </div>

      {/* Zona de subida de audio */}
      <div className="dropzone-container">
        <h3 className="dropzone-title">Subir audiolibro:</h3>
        <div {...audioDropzone.getRootProps()} className="dropzone">
          {audioFiles.length === 0 && (
            <>
              <div className="icon-container">
                <FontAwesomeIcon icon={faMusic} size="2x" className="icon" />
              </div>
              <button type="select-button" onClick={audioDropzone.open} className="select-button">
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
    </div>
  );
}

export default Drop;
