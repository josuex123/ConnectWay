import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useLocation, useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updateAudiobook } from '../../Services/AudiolibrosServicios/UpdateAudiobook';
import '../../estilos/Audiolibros/FormularioEditar/Formulario.css';
import ModalAdvertencia from '../../components/Modal/ModalNotificacion';
import ModalNotificacion from '../../components/Modal/ModalNotificacion';
import ModalConfirmacion from '../../components/Modal/ModalConfirmacion';
import ModalConfirmacion2 from '../../components/Modal/ModalConfirmacion';
import ModalConfirmacion3 from '../../components/Modal/ModalConfirmacion';
import ModalCargando from '../../components/Modal/ModalCargando'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faMusic } from '@fortawesome/free-solid-svg-icons';


const AudiobookEdit = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { audiobook } = location.state || {};
    const maxChars = 400;
    const [titulo, setTitulo] = useState('');
    const [autor, setAutor] = useState('');
    const [categoria, setCategoria] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [duracion, setDuracion] = useState('');
    const [imagenUrl, setImagenUrl] = useState('');
    const [audioUrl, setAudioUrl] = useState('');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isConfirmModal2Open, setIsConfirmModal2Open] = useState(false);
    const [isConfirmModal3Open, setIsConfirmModal3Open] = useState(false);
    const [isImageChangeConfirmed, setIsImageChangeConfirmed] = useState(false);
    const [isAudioChangeConfirmed, setIsAudioChangeConfirmed] = useState(false);
    const [isModalNotificacionOpen, setIsModalNotificacionOpen] = useState(false);
    const [notificationType, setNotificationType] = useState('success');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [isModalAdvertenciaOpen, setIsModalAdvertenciaOpen] = useState(false);
    const [notificationTypeAdver, setNotificationTypeAdver] = useState('success');
    const [notificationMessageAdver, setNotificationMessageAdver] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);
    const [audioFiles, setAudioFiles] = useState([]);
    const [audioError, setAudioError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newImage, setNewImage] = useState(null); 
    const closeModal = () => setShowModal(false);
    const storage = getStorage();

    const [isFormValid, setIsFormValid] = useState(false);
    const [initialValues, setInitialValues] = useState({
        titulo: '',
        autor: '',
        categoria: '',
        descripcion: '',
        duracion: '',
        imagenUrl: '',
        audioUrl: '',
    });

    useEffect(() => {
        const hasChanges = 
            titulo !== initialValues.titulo || 
            autor !== initialValues.autor || 
            descripcion !== initialValues.descripcion ||
            categoria !== initialValues.categoria ||
            duracion !== initialValues.duracion ||
            imagenUrl !== initialValues.imagenUrl ||
            audioUrl !== initialValues.audioUrl;
        setIsFormValid(hasChanges);
    }, [titulo, autor, descripcion, categoria,duracion,imagenUrl,audioUrl, initialValues]);
    
    useEffect(() => {
        if (audiobook) {
            const { titulo, autor, categoria, descripcion,duracion, imagenPortadaURL, archivoAudioURL } = audiobook;
            setInitialValues({
                titulo: titulo || '',
                autor: autor || '',
                categoria: categoria || '',
                descripcion: descripcion || '',
                duracion: duracion || '',
                imagenUrl: imagenPortadaURL || '',
                audioUrl: archivoAudioURL || '',
            });

            setTitulo(titulo || '');
            setAutor(autor || '');
            setCategoria(categoria || '');
            setDescripcion(descripcion || '');
            setDuracion(duracion || '');
            setImagenUrl(imagenPortadaURL || ''); 
            setAudioUrl(archivoAudioURL || '');   
        }
    }, [audiobook]);
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

    const validateTitle = (value) => {
        const regex = /^[\w\s.,;:¡!¿?"'()\-áéíóúÁÉÍÓÚñÑ]+$/;
        if (value.length > 100) {
          showModalAdvertencia('error', 'El título no puede superar los 100 caracteres.');
            return false;
        }
        if (!regex.test(value)) {
            showModalAdvertencia('error', 'El título no puede contener caracteres especiales, solo numeros, letras y y signos de puntuación.');
            return false;
        }
        return true;
    };

    const validateAutor = (value) => {
        const regex = /^[a-zA-ZÀ-ÿ\s]*$/; 
        if (value.length > 50) {
           showModalAdvertencia('error', 'El nombre del Autor no puede superar los 50 caracteres.');
            return false;
        }
        if (!regex.test(value)) {
            showModalAdvertencia('error', 'El nombre del Autor solo admite letras, letras con tílde y numeros.');
            return false;
        }
        return true;
    };
    const validateDescription= (value) => {
        const regex = /^[a-zA-ZÀ-ÿ\s.,'"()\-ñáéíóú0-9:¿?¡!:;<>]*$/; 
        if (value.length > 400) {
           showModalAdvertencia('error', 'La descripcion no puede superar los 400 caracteres.');
            return false;
        }
        if (!regex.test(value)) {
           showModalAdvertencia('error', 'Los caracteres permitidos son: letras (a-z, A-Z, áéíóú, ÁÉÍÓÚ, ñ), números (0-9), espacios, y los siguientes caracteres especiales: . , ’ " ( ) - : ¿ ? ¡ ! ; < >');
            return false;
        }
        return true;
    };
    const handleTitleChange = (e) => {
        const { value } = e.target;
        if (validateTitle(value)) {
            setTitulo(value);
        }
    };

    const handleAuthorChange = (e) => {
        const { value } = e.target;
        if (validateAutor(value)) {
            setAutor(value);
            
        }
    };

    const handleDescriptionChange = (e) => {
        const { value } = e.target;
    
        // Divide el texto ingresado en palabras
        const words = value.split(" ");
    
        // Procesa cada palabra para verificar su longitud
        const processedWords = words.map(word => {
            // Si la palabra tiene más de 40 caracteres, agrega saltos de línea
            if (word.length > 25) {
                return word.match(/.{1,25}/g).join("\n"); // Divide en bloques de 40 caracteres y agrega saltos de línea
            }
            return word;
        });
    
        // Une las palabras procesadas con espacios
        const newDescription = processedWords.join(" ");
    
        // Verifica si la descripción cumple con el criterio de validación
        if (validateDescription(newDescription)) {
            setDescripcion(newDescription);
        }
    };
    const handleSubmit = async () => {
        
        if (!titulo || !autor || !descripcion) {
            const emptyFields = [];
            if (!titulo) emptyFields.push('Título');
            if (!autor) emptyFields.push('Autor');
            if (!descripcion) emptyFields.push('Descripción');
    
           showModalAdvertencia('error', `Los siguientes campos están vacíos: ${emptyFields.join(', ')}`);
            return; // No continuar si hay campos vacíos
        }
        let imageUrlToSave = imagenUrl;
        let audioUrlToSave = audioUrl;

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
            duracion,
            imagenPortadaURL: imageUrlToSave,
            archivoAudioURL: audioUrlToSave,
        };
        closeConfirmModal(); 
        setIsLoading(true); 
        try {
            await updateAudiobook(audiobook.id, updatedData);
            closeConfirmModal();
            setIsLoading(false); 
            showModalNotificacion('success', 'El audiolibro ha sido actualizado exitosamente.');
            
        } catch (error) {
            console.error('Error al actualizar el audiolibro: ', error);
            setIsLoading(false); 
            showModalNotificacion('error', 'Hubo un error al actualizar el audiolibro.');
        }
    };
  
    const showModalNotificacion = (type, message) => {
        console.log('Abriendo modal de notificación');
        setNotificationType(type);
        setNotificationMessage(message);
        setIsModalNotificacionOpen(true); 
        
        
    };
    const showModalAdvertencia = (type, message) => {
        setNotificationTypeAdver(type);
        setNotificationMessageAdver(message);
        setIsModalAdvertenciaOpen(true); 
    };

    const closeModalNotificacion = () => {
       
       setIsModalNotificacionOpen(false);
       navigate(`/Audiolibros/registrados/1`); 
    };
    const closeModalAdvertencia = () => {
        setIsModalAdvertenciaOpen(false);
     };

     const openConfirmModal = () => {
        if (!titulo || !autor || !descripcion) {
            const emptyFields = [];
            if (!titulo) emptyFields.push('Título');
            if (!autor) emptyFields.push('Autor');
            if (!descripcion) emptyFields.push('Descripción'); 
            showModalAdvertencia('error', `Los siguientes campos están vacíos: ${emptyFields.join(', ')}`);
            return; // No continuar si hay campos vacíos
        }
    
        // Verificar si el título tiene múltiples espacios en blanco entre palabras
        const multipleSpacesPattern = /\s{2,}/;
        if (multipleSpacesPattern.test(titulo.trim())) {
            showModalAdvertencia('error', 'El campo Título no debe contener múltiples espacios en blanco entre palabras.');
            return;
        }
    
        if (descripcion.length < 50) {
            showModalAdvertencia('error', 'El campo Descripción no puede ser menor a 50 caracteres.');     
            return;
        }
    
        if (autor.length < 3) {
            showModalAdvertencia('error', 'El campo Autor no puede ser menor a 3 caracteres.');     
            return;
        }
    
        if (titulo.length < 3) {
            showModalAdvertencia('error', 'El campo Título no puede ser menor a 3 caracteres.');     
            return;
        }
    
        setIsConfirmModalOpen(true);
    };
    const closeConfirmModal = () => {
        setIsConfirmModalOpen(false);
    };
    const closeConfirmModal2 = () => {
        setIsConfirmModal2Open(false);
    };
    const closeConfirmModal3 = () => {
        setIsConfirmModal3Open(false);
    };
    /* Funciones dropzone */
    useEffect(() => {
        return () => {
            if (newImage && newImage !== imagenUrl) {
                URL.revokeObjectURL(newImage);
            }
        };
    }, [newImage, imagenUrl]);

    const handleImageUpload = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        const imagePreviewUrl = URL.createObjectURL(file);
        console.log("Ruta imagen local:", imagePreviewUrl);
        setImageFiles([file]);
        setNewImage(imagePreviewUrl);
        setImagenUrl(file);
        
    }, []);

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
            const duration = Math.round(audio.duration / 60); 
            setDuracion(duration);
            if (duration < 5 || duration > 30  ) { 
                
                setAudioError('La duración del audio debe estar entre 15 y 30 minutos.');
                setShowModal(true);
            } else {
                setAudioFiles([file]);
                setAudioUrl(file); // Actualiza audioUrl
                setAudioError(null);
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
    }, []);
    

    const imageDropzone = useDropzone({
        onDrop: handleImageUpload,
        accept: { 'image/png': [], 'image/jpeg': [] },
        noClick: true, 
        noKeyboard: true,
    });

    const audioDropzone = useDropzone({
        onDrop: onDropAudio,
        accept: { 'audio/wav': [], 'audio/mpeg': [] },
        noClick: true, 
        noKeyboard: true,
    });
    
    const handleImageChangeConfirm = () => {
        setIsImageChangeConfirmed(true);
        closeConfirmModal2(); 
    };
    
    const handleAudioChangeConfirm = () => {
    
        setIsAudioChangeConfirmed(true);
        closeConfirmModal3(); 
    };
    

    useEffect(() => {
        if (isImageChangeConfirmed) {
            imageDropzone.open();  
            setIsImageChangeConfirmed(false); 
        }
    }, [isImageChangeConfirmed]);
    
    useEffect(() => {
        if (isAudioChangeConfirmed) {
            audioDropzone.open(); 
            setIsAudioChangeConfirmed(false); 
        }
    }, [isAudioChangeConfirmed]);

    return (
        <>
            <h1 className="title">Editar Audiolibro</h1>
            <form className="form-container">
                <div className="form-group-horizontal mb-3">
                <label htmlFor="titulo"style={{ display: 'inline-flex', alignItems: 'center' }}>
                    Título:<span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                </label>
                    <div className="tooltip-container">
                        <input
                            type="text"
                            className='form-control'
                            id="titulo"
                            placeholder="Título"
                            value={titulo}
                            onChange={handleTitleChange}
                        />
                    </div>
                </div>

                <div className="form-group-horizontal mb-3">
                <label htmlFor="autor"style={{ display: 'inline-flex', alignItems: 'center' }}>
                    Autor:<span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                </label> 
                    <div className="tooltip-container">
                        <input
                            type="text"
                            className='form-control'
                            id="autor"
                            placeholder="Autor"
                            value={autor}
                            onChange={handleAuthorChange}
                        />
                    </div>
                </div>

                <div className="form-group-horizontal mb-3">
                <label htmlFor="autor"style={{ display: 'inline-flex', alignItems: 'center' }}>
                    Categoría:<span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                </label>
                    <div className="tooltip-container">
                    <select
                        id="categoria"
                        className='form-select'
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}>
                        <option value="" disabled>Elegir categoría</option>
                        <option value="meditación">Meditación</option>
                        <option value="inteligencia_emocional">Inteligencia Emocional</option>
                        <option value="salud_mental">Salud Mental</option>
                        <option value="psicología_de_parejas">Psicología de Parejas</option>
                    </select>

                    </div>
                </div>

                <div className="form-group mb-3" style={{position:'relative'}}>
                <label htmlFor="descripcion" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    Descripción:<span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                </label>
                    <span style={{ position: 'absolute', top: '0', right: '0', fontSize: '12px', color: '#888' }}>
                    {descripcion.length}/{maxChars}
                </span>
                    <div className="tooltip-container">
                        <textarea
                            id="descripcion"
                            className='form-control'
                            placeholder="Descripción"
                            value={descripcion}
                            rows="5"
                            maxLength={maxChars}
                            onChange={handleDescriptionChange}
                            style={{ resize: 'none' }}
                        />
                        
                    </div>
                </div>
                <div>
                <form  style={{ display: 'flex', justifyContent: 'space-between' }}>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Error</h3>
                        <p>{audioError}</p>
                        <button onClick={closeModal}>Cerrar</button>
                    </div>
                </div>
            )}
            <div className="oka">
             <div className="dropzone-container1">
                <h3 className="dropzone-title">
                    Imagen de la portada:<span style={{ color: 'red', marginLeft: '4px' }}>*</span>
                </h3>
                <div {...imageDropzone.getRootProps()} className="dropzone1">
                        <input 
                            {...imageDropzone.getInputProps()} 
                            style={{ display: 'none' }} 
                            id="input-imagen-portada"  // Asignar id para el input
                        />
                        {!newImage && !imagenUrl && imageFiles.length === 0 && (
                            <>
                                <div className="icon-container">
                                    <FontAwesomeIcon icon={faImage} size="2x" className="icon" />
                                </div>
                                <p>Haz clic o arrastra un archivo aquí</p>
                            </>
                        )}
                        {(newImage || imagenUrl) && (
                            <div className="uploaded-file">
                                <div className="uploaded-portada">
                                    <img
                                        src={newImage || imagenUrl || ''}
                                        alt="Portada"
                                        width="100px"
                                        className="image-preview"
                                    />
                                </div>
                                <button
                                    className="btn btn-outline-danger eliminar-botn"
                                    onClick={(e) => {
                                        e.preventDefault();  // Evita la recarga del formulario
                                        setIsConfirmModal2Open(true);
                                    }}
                                    
                                >
                                    Cambiar
                                </button>
                            </div>
                        )}
                    </div>
                                </div>
                                <div className="dropzone-container1">
                                    <h3 className="dropzone-title">
                                        Audiolibro:<span style={{ color: 'red', marginLeft: '4px' }}>*</span>
                                    </h3>
                                    <div {...audioDropzone.getRootProps()} className="dropzone1">
                        <input 
                            {...audioDropzone.getInputProps()} 
                            style={{ display: 'none' }} 
                            id="input-audiolibro"  // Asignar id para el input
                        />
                        {!audioUrl && audioFiles.length === 0 && (
                            <>
                                <div className="icon-container">
                                    <FontAwesomeIcon icon={faMusic} size="2x" className="icon" />
                                </div>
                                <p>Haz clic o arrastra un archivo aquí</p>
                            </>
                        )}
                        {(audioUrl || audioFiles.length > 0) && (
                            <div className="uploaded-file1">
                                <audio controls src={audioUrl}></audio>
                                <button
                                    className="btn btn-outline-danger eliminar-botn"
                                    onClick={(e) => {
                                        e.preventDefault();  // Evita la recarga del formulario
                                        setIsConfirmModal3Open(true);
                                    }}
                                >
                                    Cambiar
                                </button>
                            </div>
                        )}
                    </div>
             </div>
            </div>
        </form>
                </div>
               

                <div className="form-buttons-audiobook ">
                    <button className="cancel-bot" type="button" onClick={() => window.history.back()}>Cancelar</button>
                    <button className="submit-bot" type="button" 
                        onClick={openConfirmModal}
                        //disabled={!isFormValid}
                        /*style={{
                            backgroundColor: isFormValid ? '#03314B' : '#d3d3d3', 
                            color: isFormValid ? 'white' : '#666', 
                            cursor: isFormValid ? 'pointer' : 'not-allowed', 
                        }}*/
                       
                    >Guardar
                    </button>
                </div>
            </form>

            <ModalNotificacion
                isOpen={isModalNotificacionOpen}
                onClose={closeModalNotificacion}
                type={notificationType}
                message={notificationMessage}
                iconClass={notificationType === 'success' ? 'fa fa-check' : 'fa fa-exclamation'}
            />
             <ModalAdvertencia
                isOpen={isModalAdvertenciaOpen}
                onClose={closeModalAdvertencia}
                type={notificationTypeAdver}
                message={notificationMessageAdver}
                iconClass={notificationTypeAdver === 'success' ? 'fa fa-check' : 'fa fa-exclamation'}
            />
            <ModalConfirmacion
                isOpen={isConfirmModalOpen}
                onClose={closeConfirmModal}
                onConfirm={handleSubmit}
                title="Confirmar"
                description="¿Estás seguro de que deseas guardar los cambios?"
                iconClass="fa fa-save"
            />
            <ModalConfirmacion2
                isOpen={isConfirmModal2Open}
                onClose={closeConfirmModal2}
                onConfirm={handleImageChangeConfirm}
                title="Confirmar"
                description="¿Estás seguro de que deseas cambiar la portada?"
                iconClass="fa fa-question"
            />
            <ModalConfirmacion3
                isOpen={isConfirmModal3Open}
                onClose={closeConfirmModal3}
                onConfirm={handleAudioChangeConfirm}
                title="Confirmar"
                description="¿Estás seguro de que deseas cambiar el audio?"
                iconClass="fa fa-question"
            />
            <ModalCargando
                isOpen={isLoading} 
                onClose={() => {}}
                type="loading"
                message="Cargando, por favor espera...\n "
                iconClass="fa fa-spinner fa-spin" 
                />
        </>
    );
};
export default AudiobookEdit;
