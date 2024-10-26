import React, { useCallback, useState } from 'react';
import Navbar from '../../components/PaginaInicio/Navbar';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../estilos/comunidad/comunidad.css';
import { getFirestore, doc, addDoc, collection } from "firebase/firestore";
import { app } from '../../firebaseConfig';
import { subirImagenYObtenerUrl } from '../../Services/ComunidadesServicios/SubirImgYobtenerUrl';
import ModalNotificacion from '../../components/Modal/ModalNotificacion';

function FormularioCrearComunidad() {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const db = getFirestore(app);
  const maxCharsDescripcion = 400;
  const maxCharsTitulo = 100;

  const handleNombreChange = (e) => {
    if (e.target.value.length <= maxCharsTitulo) {
      setNombre(e.target.value);
    }
  };

  const handleDescripcionChange = (e) => {
    if (e.target.value.length <= maxCharsDescripcion) {
      setDescripcion(e.target.value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!nombre || !categoria || !descripcion || imageFiles.length === 0) {
      setModalType('error');
      setModalMessage('Por favor, completa todos los campos y sube una imagen.');
      setShowModal(true);
      return;
    }

    try {
      const imagenUrl = await subirImagenYObtenerUrl(imageFiles[0]);

      const comunidadDoc = {
        nombre,
        descripcion,
        imagenURL: imagenUrl,
      };

      const categoriaRef = doc(db, "Comunidades", categoria);
      await addDoc(collection(categoriaRef, "comunidades"), comunidadDoc);

      setNombre('');
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
    }
  };

  const onDropImage = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
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
      <Navbar />

      <h1 className="title">Crear Comunidad</h1>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Título:</label>
            <span style={{ fontSize: '12px', color: '#888', float: 'right' }}>{nombre.length}/{maxCharsTitulo}</span>
            <input
              type="text"
              className="form-control"
              id="nombre"
              placeholder="Ej: Inteligencia Emocional"
              value={nombre}
              onChange={handleNombreChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoria">Categoría:</label>
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

          <div className="form-group" style={{ position: 'relative' }}>
            <label htmlFor="descripcion">Descripción:</label>
            <span style={{ position: 'absolute', top: '0', right: '0', fontSize: '12px', color: '#888' }}>
              {descripcion.length}/{maxCharsDescripcion}
            </span>
            <textarea
              id="descripcion"
              className="form-control"
              placeholder="Escribe una breve descripción de la comunidad"
              value={descripcion}
              onChange={handleDescripcionChange}
              rows="4"
              style={{ resize: 'none' }}
            />
          </div>

          <div className="form-group">
            <label>Subir imagen:</label>
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
                  <img 
                    src={imageFiles[0].preview} 
                    alt={imageFiles[0].name} 
                    width="100px" 
                    style={{ cursor: 'pointer' }}
                  />
                  <p>{imageFiles[0].name}</p>
                  <button type="button" className="btn btn-danger" onClick={removeImageFile}>Eliminar</button>
                </div>
              )}
            </div>
          </div>

          <div className="form-buttons">
            <button type="button" className="btn btn-secondary" onClick={() => window.history.back()}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Crear</button>
          </div>
        </form>

        {/* Modal de Notificación */}
        <ModalNotificacion
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          type={modalType}
          message={modalMessage}
          iconClass={modalType === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}
        />
      </div>
    </>
  );
}

export default FormularioCrearComunidad;