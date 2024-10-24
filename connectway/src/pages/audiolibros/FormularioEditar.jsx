import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updateAudiobook } from '../../Services/AudiolibrosServicios/UpdateAudiobook';
import '../../estilos/Audiolibros/FormularioAñadir/Formulario.css';
import EditMediaDrop from '../../components/Dropzone/EditMediaDrop'; 
import ModalAdvertencia from '../../components/Modal/ModalNotificacion';
import ModalNotificacion from '../../components/Modal/ModalNotificacion';
import ModalConfirmacion from '../../components/Modal/ModalConfirmacion';

const AudiobookEdit = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { audiobook } = location.state || {};

    const [titulo, setTitulo] = useState('');
    const [autor, setAutor] = useState('');
    const [categoria, setCategoria] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imagenUrl, setImagenUrl] = useState('');
    const [audioUrl, setAudioUrl] = useState('');

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const [isModalNotificacionOpen, setIsModalNotificacionOpen] = useState(false);
    const [notificationType, setNotificationType] = useState('success');
    const [notificationMessage, setNotificationMessage] = useState('');

    const [isModalAdvertenciaOpen, setIsModalAdvertenciaOpen] = useState(false);
    const [notificationTypeAdver, setNotificationTypeAdver] = useState('success');
    const [notificationMessageAdver, setNotificationMessageAdver] = useState('');

    const storage = getStorage();

    const [isFormValid, setIsFormValid] = useState(false);
    const [initialValues, setInitialValues] = useState({
        titulo: '',
        autor: '',
        categoria: '',
        descripcion: '',
        imagenUrl: '',
        audioUrl: '',
    });

    useEffect(() => {
        const hasChanges = 
            titulo !== initialValues.titulo || 
            autor !== initialValues.autor || 
            descripcion !== initialValues.descripcion ||
            categoria !== initialValues.categoria ||
            imagenUrl !== initialValues.imagenUrl ||
            audioUrl !== initialValues.audioUrl;
        setIsFormValid(hasChanges);
    }, [titulo, autor, descripcion, categoria,imagenUrl,audioUrl, initialValues]);
    

    useEffect(() => {
        if (audiobook) {
            const { titulo, autor, categoria, descripcion, imagenPortadaURL, archivoAudioURL } = audiobook;
            setInitialValues({
                titulo: titulo || '',
                autor: autor || '',
                categoria: categoria || '',
                descripcion: descripcion || '',
                imagenUrl: imagenPortadaURL || '',
                audioUrl: archivoAudioURL || '',
            });

            setTitulo(titulo || '');
            setAutor(autor || '');
            setCategoria(categoria || '');
            setDescripcion(descripcion || '');
            setImagenUrl(imagenPortadaURL || ''); 
            setAudioUrl(archivoAudioURL || '');   
        }
    }, [audiobook]);

    // Función para subir la imagen a Firebase Storage
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

    // Función para subir el archivo de audio a Firebase Storage
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
        const regex = /^[a-zA-ZÀ-ÿ0-9\s]*$/; // Permitir solo letras, números y espacios
        if (value.length > 100) {
          showModalAdvertencia('error', 'El título no puede superar los 100 caracteres.');
            return false;
        }
        if (!regex.test(value)) {
            showModalAdvertencia('error', 'El título no puede contener caracteres especiales, solo numeros, letras y letras con tíldes.');
            return false;
        }
        return true;
    };

    const validateAutor = (value) => {
        const regex = /^[a-zA-ZÀ-ÿ\s]*$/; // Permitir solo letras y espacios
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
        const regex = /^[a-zA-ZÀ-ÿ\s.,'"()\-ñáéíóú0-9:¿?¡!:;<>]*$/; // Permitir solo letras y espacios
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
        if (validateDescription(value)) {
            setDescripcion(value);
           
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
            imagenPortadaURL: imageUrlToSave,
            archivoAudioURL: audioUrlToSave,
        };

        try {
            await updateAudiobook(audiobook.id, updatedData);
            closeConfirmModal();
            showModalNotificacion('success', 'El audiolibro ha sido actualizado exitosamente.');
            
        } catch (error) {
            console.error('Error al actualizar el audiolibro: ', error);
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
        if(descripcion.length<50){
           showModalAdvertencia('error', `El campo Descripción no puede ser menor a 50 caracteres`);     
            return;
        }
        if(autor.length<3){
           showModalAdvertencia('error', `El campo Autor no puede ser menor a 3 caracteres`);     
            return;
        }
        if(titulo.length<3){
           showModalAdvertencia('error', `El campo Titulo no puede ser menor a 3 caracteres`);     
            return;
        }
        setIsConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        setIsConfirmModalOpen(false);
    };
   
    

    return (
        <>
            <h1 className="title">Editar Audiolibro</h1>
            <form className="form-container">
                <div className="form-group-horizontal mb-3">
                    <label htmlFor="titulo">Título:</label>
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
                    <label htmlFor="autor">Autor:</label>
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
                    <label htmlFor="categoria">Categoría:</label>
                    <div className="tooltip-container">
                    <select
                        id="categoria"
                        className='form-select'
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}>
                        <option value="" disabled>Elegir categoría</option>
                        <option value="meditacion">Meditación</option>
                        <option value="inteligencia_emocional">Inteligencia Emocional</option>
                        <option value="salud_mental">Salud Mental</option>
                        <option value="psicologia_de_parejas">Psicología de Parejas</option>
                    </select>

                    </div>
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="descripcion">Descripción:</label>
                    <div className="tooltip-container">
                        <textarea
                            id="descripcion"
                            className='form-control'
                            placeholder="Descripción"
                            value={descripcion}
                            rows="5"
                            maxLength="500"
                            onChange={handleDescriptionChange}
                            style={{ resize: 'none' }}
                        />
                    </div>
                </div>

                <EditMediaDrop
                    initialImageUrl={imagenUrl}   
                    initialAudioUrl={audioUrl}    
                    onImageChange={setImagenUrl}  
                    onAudioChange={setAudioUrl}   
                />

                <div className="form-buttons">
                    <button className="cancel-bot" type="button" onClick={() => window.history.back()}>Cancelar</button>
                    <button className="submit-bot" type="button" 
                        onClick={openConfirmModal}
                        disabled={!isFormValid}
                        style={{
                            backgroundColor: isFormValid ? '#03314B' : '#d3d3d3', 
                            color: isFormValid ? 'white' : '#666', 
                            cursor: isFormValid ? 'pointer' : 'not-allowed', 
                        }}
                       
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
        </>
    );
};

export default AudiobookEdit;
