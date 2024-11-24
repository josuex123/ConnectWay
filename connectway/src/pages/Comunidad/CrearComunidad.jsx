import React, { useCallback, useState } from 'react';
import Navbar from '../../components/PaginaInicio/Navbar';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage,faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom'; // Importa useNavigate para la redirección
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../estilos/comunidad/comunidad.css';
import { getFirestore, doc, addDoc, collection } from "firebase/firestore";
import { app } from '../../firebaseConfig';
import { subirImagenYObtenerUrl } from '../../Services/ComunidadesServicios/SubirImgYobtenerUrl';
import ModalNotificacion from '../../components/Modal/ModalNotificacion';
import ModalCargando from '../../components/Modal/ModalCargando'; 

function FormularioCrearComunidad() {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const db = getFirestore(app);
  const navigate = useNavigate(); 
  const maxCharsDescripcion = 400;
  const maxCharsTitulo = 100;
  const [titulo, setTitulo] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const { role } = useParams();
  const [showTooltipIcon1, setShowTooltipIcon1] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  
  const validateAlphanumeric = (value) => /^[a-zA-Z0-9\s]*$/.test(value);


  //Validar desde dónde se accedió a formulario y redirigir a Home/1 o /0
  const handleCancelar = () =>{
    const redirectionPath = role === '1' ? '/Home/1' : '/Home/0';
    navigate(redirectionPath);
  }

  const handleTituloChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxCharsTitulo && validateAlphanumeric(value)) {
      setTitulo(value);
    }
  };
  
  const handleDescripcionChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxCharsDescripcion && validateAlphanumeric(value)) {
      setDescripcion(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!titulo || !categoria || !descripcion || imageFiles.length === 0 || !validateAlphanumeric(titulo) || !validateAlphanumeric(descripcion)) {
      setModalType('error');
      setModalMessage('Por favor, completa todos los campos y sube una imagen.');
      setShowModal(true);
      return;
    }
    setIsLoading(true);

    try {
      const imagenUrl = await subirImagenYObtenerUrl(imageFiles[0]);
      const comunidadDoc = { titulo, descripcion, imagenURL: imagenUrl };
      const categoriaRef = doc(db, "Comunidades", categoria);
      const comunidadRef = await addDoc(collection(categoriaRef, "comunidades"), comunidadDoc);
      
      setTitulo('');
      setCategoria('');
      setDescripcion('');
      setImageFiles([]);

      setModalType('success');
      setModalMessage('Comunidad creada correctamente.');
      setShowModal(true);
    } catch (error) {
      setModalType('error');
      setModalMessage('Error al crear la comunidad. Intenta de nuevo.');
      setShowModal(true);
    }finally{
      setIsLoading(false);
    }
  };

  const onDropImage = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      if (file.size > 5 * 1024 * 1024) { 
        setModalType('error');
        setModalMessage('La imagen no debe pesar más de 5MB.');
        setShowModal(true);
        return;
      }
      
      setImageFiles([Object.assign(file, {
        preview: URL.createObjectURL(file)
      })]);
    }
  }, []);

  const imageDropzone = useDropzone({
    onDrop: onDropImage,
    accept: { 'image/png': [], 'image/jpeg': [] },
    noClick: true
  });

  const removeImageFile = () => setImageFiles([]);

  return (
    <>
  <div className="pagina-inicio">
      <Navbar />

      <h1 className="title">Crear Comunidad</h1>
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group-horizontal mb-3">
          <label htmlFor="nombre">
            Título:<span style={{ color: 'red' }}>*</span>
            </label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
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
                  onChange={handleTituloChange} 
                />
                    {showTooltip && (
                        <div className="tooltip-box">
                            El título no debe superar los 100 caracteres y solo se acepta números y caracteres
                            alfabéticos.
                        </div>
                    )}
                </div>
                <span style={{ fontSize: '12px', color: '#888', marginLeft: '10px' }}>
                {titulo.length}/{maxCharsTitulo}
              </span>
            </div>
            </div>
            
          </div>

          <div className="form-group-horizontal mb-3">
          <label htmlFor="nombre">
            Categoría:<span style={{ color: 'red', marginLeft: '5px' }}>*</span>
          </label>

            <select
              id="categoria"
              className="form-control"
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

          <div className="form-group mb-3" style={{ position: 'relative' }}>
          <label htmlFor="nombre">
             Descripción:<span style={{ color: 'red', marginLeft: '5px' }}>*</span>
            </label>

            <span style={{ position: 'absolute', top: '0', right: '0', fontSize: '12px', color: '#888' }}>
              {descripcion.length}/{maxCharsDescripcion}
            </span>
            <div
                className="tooltip-container"
                onMouseEnter={() => setShowTooltip(descripcion === "")}
                onMouseLeave={() => setShowTooltip(false)}
            >
            <textarea
              id="descripcion"
              className="form-control"
              placeholder="Escribe una breve descripción de la comunidad"
              value={descripcion}
              onChange={handleDescripcionChange}
              rows="4"
              style={{ resize: 'none' }}
            />
                            {showTooltip && (
                    <div className="tooltip-box">
                       La descripción no debe superar los 400 caracteres y sólo se acepta números y
                       caracteres alfabéticos
                    </div>
                )}
            </div>
          </div>

          <div className="form-group">
          <label htmlFor="nombre">
            Subir Imagen:<span style={{ color: 'red', marginLeft: '5px' }}>*</span>
          </label>

            <span   
                        className="info-icon" 
                        onMouseEnter={() => setShowTooltipIcon1(true)}
                        onMouseLeave={() => setShowTooltipIcon1(false)}
                    >
                        <FontAwesomeIcon icon={faInfoCircle}/>
                        {showTooltipIcon1 && (
                            <div className="tooltip-box-icon">
                                Elija una imagen representativa en formato JPG o PNG.
                                La imagen no debe pesar más de 5MB.<br/>
                            </div>
                        )}
                    </span>
            <div {...imageDropzone.getRootProps()} className="dropzone">
              {imageFiles.length === 0 && (
                <>
                  <FontAwesomeIcon icon={faImage} size="2x" />
                  <button type="button" onClick={imageDropzone.open} className="btn btn-secondary">
                    Sube un archivo
                  </button>
                  <p>ó deslízalo aquí</p>
                </>
              )}
              <input {...imageDropzone.getInputProps()} style={{ display: 'none' }} />
              {imageFiles.length > 0 && (
                <div className="uploaded-file">
                  <img src={imageFiles[0].preview} alt={imageFiles[0].name} width="100px" style={{ cursor: 'pointer' }} />
                  <p>{imageFiles[0].name}</p>
                  <button type="button" className="eliminar-botton" onClick={removeImageFile}>Eliminar</button>
                </div>
              )}
            </div>
          </div>

          <div className="form-buttons-audiobook" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="cancel-bot" onClick={handleCancelar}>
              Cancelar
            </button>
            <button type="submit" className="submit-bot">
              Crear
            </button>
          </div>
        </form>

        <ModalNotificacion
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          type={modalType}
          message={modalMessage}
          iconClass={modalType === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}
        />
      </div>
  </div>
  <ModalCargando isOpen={isLoading} message="La comunidad se está creando..."/>
    </>
  );
}

export default FormularioCrearComunidad;
