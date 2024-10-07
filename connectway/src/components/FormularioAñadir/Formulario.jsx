import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faMusic, faExclamationCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../estilos/Audiolibros/FormularioAñadir/Formulario.css';

function Formulario() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [showImageInfo, setShowImageInfo] = useState(true);

  const [imageFiles, setImageFiles] = useState([]);
  const [audioFiles, setAudioFiles] = useState([]);
  const [audioError, setAudioError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,]+$/;

  const handleCancel = () => {
    setTitulo('');
    setAutor('');
    setCategoria('');
    setDescripcion('');
    setImageFiles([]);
    setAudioFiles([]);
    setError('');
    window.location.href = "/";
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if(!titulo || !autor || !categoria || !descripcion){
      setError('Por favor, rellena todos los campos antes de enviar el formulario.');
      return;
    }

    if(!textRegex.test(titulo) || !textRegex.test(autor)) {
      setError('El título y el autor solo pueden contener letras y signos de puntuación comunes.');
      return;
    }

    if(audioFiles.length === 0 || imageFiles.length === 0){
      setError('No deje vacio los campos para subir archivos');
      return;
    }
    setError('');
    console.log({ titulo, autor, categoria, descripcion, imageFiles, audioFiles });
  };

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
    <>
      <h1 className="title">Subir Audiolibro</h1>
      <form onSubmit={handleSubmit} className="form-container">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="titulo">Título:</label>
              <div
                className="tooltip-container"
                onMouseEnter={() => setShowTooltip(titulo === "")}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <input
                  type="text"
                  className="form-control"
                  id="titulo"
                  placeholder="Ej: Inteligencia Emocional"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
                  {showTooltip && (
                  <div className="tooltip-box">
                    El título debe contener solo letras (A-Z, a-z).
                  </div>
                  )}
              </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="autor">Autor:</label>
              <div
                className="tooltip-container"
                 onMouseEnter={() => setShowTooltip(autor === "")}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <input
                  type="text"
                  className="form-control"
                  id="autor"
                  placeholder="Ej: Daniel Goleman"
                  value={autor}
                  onChange={(e) => setAutor(e.target.value)}
                />
                {showTooltip && (
                  <div className="tooltip-box">
                    El nombre del autor debe contener solo letras (A-Z, a-z).
                  </div>
                )}
              </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="categoria">Categoría:</label>
            
            <select
              id="categoria"
              className="form-select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Elegir categoría</option>
              <option value="meditacion">Meditación</option>
              <option value="inteligencia_emocional">Inteligencia Emocional</option>
              <option value="salud_mental">Salud mental en la Universidad</option>
              <option value="psicologia_parejas">Psicología de parejas</option>
            </select>
            
          </div>
        </div>

        <div className="form-group mb-3">
          <label htmlFor="descripcion">Descripción:</label>
          <div
                className="tooltip-container"
                onMouseEnter={() => setShowTooltip(descripcion === "")}
                onMouseLeave={() => setShowTooltip(false)}
              >
          <textarea
            id="descripcion"
            className="form-control"
            placeholder="Escribe una breve descripción del libro"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows="5"
            maxLength="500"
            style={{ resize: 'none' }}
          />
           {showTooltip && (
                  <div className="tooltip-box">
                    La descipción debe tener 400 ceracteres como máximo, 
                    usar solo letras y numeros
                  </div>
                )}
              </div>
        </div>

        <div className="file-upload-container">
          <div className="dropzone-container">
            <h3 className="dropzone-title">Subir portada:
            <span className="info-icon" onMouseEnter={() => setShowImageInfo(true)} onMouseLeave={() => setShowImageInfo(false)}>
              <FontAwesomeIcon icon={faInfoCircle} />
              {showImageInfo && (
                <div className="tooltip-box">
                  La portada debe ser una imagen en formato JPG o PNG y no debe exceder los 5MB.
                </div>
              )}
            </span>
            </h3>
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
          </div>

          <div className="dropzone-container">
            <h3 className="dropzone-title">Subir audiolibro:
              <span className="info-icon" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
                <FontAwesomeIcon icon={faInfoCircle} />
                {showTooltip && (
                  <div className="tooltip-box">
                    La portada debe ser una imagen en formato JPG o PNG y no debe exceder los 5MB.
                  </div>
                )}
              </span>
            </h3>
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
        </div>

        <div className="d-flex justify-content-between mt-3">
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            Subir Audiolibro{/* AQUI PONER LA FUNCONALIDAD DEL BOTON */}
          </button>
        </div>
      </form>

      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <FontAwesomeIcon icon={faExclamationCircle} size="3x" style={{ color: 'black' }} />
          <p className="mt-3">{audioError}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Formulario;
