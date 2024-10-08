import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faMusic, faExclamationCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';
import ModalNotificacion from '../../components/Modal/ModalNotificacion';
import { collection, addDoc } from 'firebase/firestore';
import { db , storage} from '../../firebaseConfig'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
  const [showTooltipIcon1, setShowTooltipIcon1] = useState(false);
  const [showTooltipIcon2, setShowTooltipIcon2] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [audioFiles, setAudioFiles] = useState([]);
  const [audioError, setAudioError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,]+$/;

  const [isModalNotificacionOpen, setIsModalNotificacionOpen] = useState(false);
  const [notificationType, setNotificationType] = useState('success'); 
  const [notificationMessage, setNotificationMessage] = useState('');


  const showModalNotificacion = (type, message) => { 
    setNotificationType(type);
    setNotificationMessage(message); 
    setIsModalNotificacionOpen(true);
  };

  const closeModalNotificacion = async () => {
      setIsModalNotificacionOpen(false);
  };

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
  const uploadFileToStorage = async (file) => {
    const storageRef = ref(storage, `uploads/${file.name}`);
    await uploadBytes(storageRef, file);
    const fileURL = await getDownloadURL(storageRef);
    return fileURL;
};
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!titulo || !autor || !categoria || !descripcion) {
        setError('Por favor, rellena todos los campos antes de enviar el formulario.');
        return;
    }

    if (!textRegex.test(titulo) || !textRegex.test(autor)) {
        setError('El título y el autor solo pueden contener letras y signos de puntuación comunes.');
        return;
    }

    if (audioFiles.length === 0 || imageFiles.length === 0) {
        setError('No deje vacio los campos para subir archivos');
        return;
    }

    setError('');

    try {
        const imageUrl = await uploadFileToStorage(imageFiles[0]);
        const audioUrl = await uploadFileToStorage(audioFiles[0]);

        const audiolibroData = {
            titulo,
            autor,
            categoria,
            descripcion,
            duracion: audioFiles[0].duration, // Asegúrate de tener esta propiedad
            imagenPortadaURL: imageUrl,
            archivoAudioURL: audioUrl,
            creadoEn: new Date(),
            actualizadoEn: new Date(),
        };

        const docRef = await addDoc(collection(db, 'audiolibros'), audiolibroData);
        console.log("Audiolibro agregado con ID: ", docRef.id);
        showModalNotificacion('success', 'Audiolibro agregado exitosamente!');
    } catch (error) {
        console.error("Error al agregar audiolibro: ", error);
        showModalNotificacion('error', 'Error al agregar el audiolibro. Intente de nuevo.');
    }
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
      if ( duration > 30) {
        setAudioError('La duración del audio debe ser menor a 30 minutos.');
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

        <div className="form-group-horizontal mb-3">
          <label htmlFor="titulo">Título:</label>
          <div
                className="tooltip-container"
                onMouseEnter={() => setShowTooltip(titulo === "")}
                onMouseLeave={() => setShowTooltip(false)}
          >
          <div className="tooltip-container">
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
            <h3 className="dropzone-title">
              Subir portada:
              <span className="info-icon" 
                    onClick={() => setShowTooltipIcon1(!showTooltipIcon1)}
              >
                <FontAwesomeIcon icon={faInfoCircle}/>
                {showTooltipIcon1 && (
                <div className="tooltip-box-icon">
                  Elija una imagen representativa en formato JPG o PNG.<br/>
                  El peso de la imagen no debe exceder los 5MB.
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
    {imageFiles.map((file) => (
      <div key={file.path}>
        <img 
          src={file.preview} 
          alt={file.name} 
          width="100px" 
          onClick={imageDropzone.open} 
          style={{ cursor: 'pointer' }} 
        />
        <p>{file.name}</p>
      </div>
    ))}
  </div>
)}

            </div>
          </div>

          <div className="dropzone-container">
            <h3 className="dropzone-title">Subir audiolibro:
              <span className="info-icon" 
                    onClick={() => setShowTooltipIcon2(!showTooltipIcon2)}
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  {showTooltipIcon2 && (
                  <div className="tooltip-box-icon">
                    El formato de audio debe ser en MP3 ó WAV.<br/>
                    El peso limite del audiolibro es de 200MG.
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
          <button type="button" 
                  className="btn btn-secondary" 
                  onClick={handleCancel}>
            Cancelar
          </button>
          <button type="submit" 
                  className="btn btn-primary"
                  >
            Subir Audiolibro
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
        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={closeModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <ModalNotificacion
                isOpen={isModalNotificacionOpen}
                onClose={closeModalNotificacion}
                type={notificationType}
                message={notificationMessage}
                iconClass={notificationType === 'success' ? 'fa fa-check' : 'fa fa-exclamation'}
            />
    </>
  );
}

export default Formulario;
