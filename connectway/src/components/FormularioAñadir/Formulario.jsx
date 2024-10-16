import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faMusic, faExclamationCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';
import ModalNotificacion from '../../components/Modal/ModalNotificacion';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../estilos/Audiolibros/FormularioAñadir/Formulario.css';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from '../../firebaseConfig';

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
  const [duracion, setDuracion] = useState(0);
  const storage = getStorage(app);
  const db = getFirestore(app);

  const showModalNotificacion = (type, message) => { 
    setNotificationType(type);
    setNotificationMessage(message); 
    setIsModalNotificacionOpen(true);
  };

  const closeModalNotificacion = async () => {
      setIsModalNotificacionOpen(false);
  };

  const handleCancel = () => {
    window.location.href = "/Home";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!titulo || !autor || !categoria || !descripcion) {
      setError('Por favor, rellena todos los campos antes de enviar el formulario.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
  
    if (!textRegex.test(titulo) || !textRegex.test(autor)) {
      setError('El título y el autor solo pueden contener letras y signos de puntuación comunes.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
  
    if (audioFiles.length === 0 || imageFiles.length === 0) {
      setError('No dejes vacío los campos para subir archivos.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
  
    setError('');
  
    try {
      // Subir la imagen al Storage
      const imageFile = imageFiles[0];
      const imageRef = ref(storage, `Portadas/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);
  
      // Subir el audio al Storage
      const audioFile = audioFiles[0];
      const audioRef = ref(storage, `Audios/${audioFile.name}`);
      await uploadBytes(audioRef, audioFile);
      const audioUrl = await getDownloadURL(audioRef);
  
      // Guardar en Firestore
      const audiolibroDoc = {
        titulo,
        autor,
        categoria,
        descripcion,
        duracion,
        imagenPortadaURL: imageUrl,
        archivoAudioURL: audioUrl
      };
  
      await addDoc(collection(db, "Audiolibro"), audiolibroDoc);
  
      showModalNotificacion('success', 'Audiolibro subido correctamente');
    } catch (error) {
      setError('Error al subir el audiolibro, por favor intenta nuevamente.');
      showModalNotificacion('error', 'Hubo un problema al subir el audiolibro.');
    }
  };

  const closeModal = () => setShowModal(false);

  const onDropImage = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const img = new Image();
  
      img.onload = () => {
        const maxWidth = 177;
        const maxHeight = 284;
  
        console.log("width: "+ img.width);
        console.log("heigth: "+ img.height);
        if (img.width > maxWidth + 20 || img.height > maxHeight + 20 || img.width < maxWidth - 20 || img.height < maxHeight - 20) {
          setError(`La imagen debe estar en tamaño de 1000x1600.`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
  
        // Crear un canvas con las dimensiones deseadas
        const canvas = document.createElement('canvas');
        canvas.width = maxWidth; // Establecer ancho a 1000
        canvas.height = maxHeight; // Establecer alto a 1600
        const ctx = canvas.getContext('2d');
        
        // Dibujar la imagen en el canvas
        ctx.drawImage(img, 0, 0, maxWidth, maxHeight);
  
        // Convertir el canvas a un blob y crear un archivo
        canvas.toBlob((blob) => {
          const resizedFile = new File([blob], file.name, { type: file.type });
          setImageFiles([Object.assign(resizedFile, {
            preview: URL.createObjectURL(resizedFile)
          })]);
        }, file.type);
      };
  
      img.src = URL.createObjectURL(file);
    }
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
      const duration = Math.round(audio.duration / 60); 
      setDuracion(duration);
      if ( duration > 30) {
        setAudioError('La duración del audio debe ser menor a 30 minutos.');
        setShowModal(true);
      } else {
        setAudioFiles([file]);
        setAudioError(null);
      }
    };
  }, []);

  //const removeImageFile = () => setImageFiles([]);
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
              placeholder="Ej: La Ventaja De Ser Introvertido"
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

       
        <div className='form-group-horizontal mb-3'>
        <label htmlFor="autor">Autor:</label> 
            
            <div className='tooltip-container'>
            
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
        <div className='form-group-horizontal mb-3'>
          <label htmlFor="autor">Categoría:</label>
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
                La descipción debe tener 400 caracteres como máximo, 
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
                  El peso de la imagen no debe exceder los 5MB y<br/>
                  la imagen debe estar en un tamaño de 1000x1600.
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
                  
                  {audioFiles.map((file) => (
                    <div key={file.path}>
                      <p>{file.name}</p>
                      <button className="btn btn-outline-danger eliminar-botton" onClick={removeAudioFile}>Eliminar</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='form-buttons'>
          <button className="cancel-bot" type="button" 
                  onClick={handleCancel}> Cancelar
          </button>
          <button className="submit-bot" type="submit" 
                > Subir 
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
