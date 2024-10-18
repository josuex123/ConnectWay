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
import { faSpinner } from '@fortawesome/free-solid-svg-icons';


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
  const textTit = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,0123456789]+$/;
  const textAut = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,]+$/;

  const [isModalNotificacionOpen, setIsModalNotificacionOpen] = useState(false);
  const [notificationType, setNotificationType] = useState('success'); 
  const [notificationMessage, setNotificationMessage] = useState('');
  const [duracion, setDuracion] = useState(0);
  const storage = getStorage(app);
  const db = getFirestore(app);
  const [isLoading, setIsLoading] = useState(false);  // Estado de carga

  const showModalNotificacion = (type, message) => { 
    setNotificationType(type);
    setNotificationMessage(message); 
    setIsModalNotificacionOpen(true);
  };

  const closeModalNotificacion = async () => {
      setIsModalNotificacionOpen(false);
  };

  const handleCancel = () => {
    window.location.href = "/Home/1";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    setIsLoading(true);

    if (!titulo) {
      setError('Por favor, rellena el título en el formulario.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!autor) {
      setError('Por favor, rellena el autor antes de enviar el formulario.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!categoria) {
      setError('Por favor, selecciona un categoria antes de enviar le formulario.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!descripcion) {
      setError('Por favor, escribe una descripción antes de enviar el formulario.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
  
    if (!textTit.test(titulo)) {
      setError('El título solo puede contener letras, numeros y signos de puntuación comunes.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
  
    if (!textAut.test(autor)) {
      setError('El autor solo puede contener letras y signos de puntuación comunes.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!textAut.test(descripcion)) {
      setError('La descipción solo puede contener letras y signos de puntuación comunes.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
  
    if (imageFiles.length === 0) {
      setError('Por favor, sube la portada del libro antes de enviar el formulario.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (audioFiles.length === 0) {
      setError('Por favor, sube el audiolibro antes de enviar el formulario.');
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

      setIsLoading(false);  // Termina la animación
      showModalNotificacion('success', 'Audiolibro subido correctamente');
      setTitulo('');
      setAutor('');
      setCategoria('');
      setDescripcion('');
      setImageFiles([]);
      setAudioFiles([]);
      setDuracion(0);
    } catch (error) {
        setIsLoading(false);  // Termina la animación si hay error
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
        const minWidth = 1000;
        const minHeight = 1600;
    
        console.log("width: " + img.width);
        console.log("height: " + img.height);
    
        // Verificar si la imagen cumple con el tamaño mínimo de 1000x1600
        if (img.width < minWidth || img.height < minHeight) {
            setError(`La imagen debe tener un tamaño mínimo de ${minWidth}x${minHeight} píxeles.`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
    
        // Si la imagen cumple con el tamaño mínimo o es mayor, se redimensiona a un máximo de 1000x1600
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
    
        // Si la imagen es más grande que 1000x1600, redimensionarla
        if (width > minWidth || height > minHeight) {
            // Calcular la proporción para mantener la relación de aspecto
            const aspectRatio = width / height;
            if (aspectRatio > 1) { // Si la imagen es más ancha
                width = minWidth;
                height = minWidth / aspectRatio;
            } else { // Si la imagen es más alta
                height = minHeight;
                width = minHeight * aspectRatio;
            }
        }
    
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
    
        // Dibujar la imagen redimensionada en el canvas
        ctx.drawImage(img, 0, 0, width, height);
    
        // Convertir el canvas en un archivo blob y crear un archivo nuevo
        canvas.toBlob((blob) => {
            const resizedFile = new File([blob], file.name, { type: file.type });
            setImageFiles([Object.assign(resizedFile, {
                preview: URL.createObjectURL(resizedFile)
            })]);
        }, file.type);
    };
    
    // Asignar la fuente de la imagen
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
      if ( duration > 30 || duration < 10) {
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
    <h1 className="title">Registrar Audiolibro</h1>
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
                        maxLength="100"
                        onChange={(e) => setTitulo(e.target.value)}
                    />
                    {showTooltip && (
                        <div className="tooltip-box">
                            El título debe contener solo letras y números.<br/>
                            Un máximo de 100 caracteres.
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
                    maxLength="100"
                    onChange={(e) => setAutor(e.target.value)}
                    />
                    {showTooltip && (
                        <div className="tooltip-box">
                            El nombre del autor debe contener solamente letras 
                            y algunos signos de puntuación comunes.<br/>
                            Un máximo de 100 caracteres.
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
                <option value="salud_mental">Salud Mental</option>
                <option value="psicologia_de_parejas">Psicología de parejas</option>
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
                    maxLength="400"
                    style={{ resize: 'none' }}
                />
                {showTooltip && (
                    <div className="tooltip-box">
                        La descipción debe tener 400 caracteres como máximo, 
                        usar solo letras y números.
                    </div>
                )}
            </div>
        </div>

        <div className="file-upload-container">
            <div className="dropzone-container">
                <h3 className="dropzone-title">
                    Subir portada:
                    <span   
                        className="info-icon" 
                        onMouseEnter={() => setShowTooltipIcon1(true)}
                        onMouseLeave={() => setShowTooltipIcon1(false)}
                    >
                        <FontAwesomeIcon icon={faInfoCircle}/>
                        {showTooltipIcon1 && (
                            <div className="tooltip-box-icon">
                                Elija una imagen representativa en formato JPG o PNG.<br/>
                                El peso de la imagen no debe exceder los 5MB y 
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
                                width="73px" 
                                onClick={imageDropzone.open} 
                                style={{ cursor: 'pointer' }} 
                            />
                            <p>{file.name}</p>
                            <button className="eliminar-botton" style={{ marginTop: '-10px' }}  onClick={removeImageFile}>Cambiar</button>
                            </div>
                        ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="dropzone-container">
                <h3 className="dropzone-title">Subir audiolibro:
                    <span className="info-icon" 
                        onMouseEnter={() => setShowTooltipIcon2(true)}
                        onMouseLeave={() => setShowTooltipIcon2(false)}
                        
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
                        <div>
                            <audio controls src={URL.createObjectURL(audioFiles[0])}></audio>
                            <p>{audioFiles[0].name}</p>
                            <button className="eliminar-botton" style={{ marginTop: '25px' }} onClick={removeAudioFile}>Cambiar</button>
                        </div>
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
                > Registrar 
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
  
    
 <div className="loading-icon" style={{
    position: 'fixed', 
    bottom: '20px', 
    left: '20px', 
    display: isLoading ? 'block' : 'none'  // Solo se muestra si isLoading es true
  }}>
    <FontAwesomeIcon icon={faSpinner} spin size="2x" />
  </div>
</>
  );
}

export default Formulario;
