import React, { useCallback, useState } from 'react';
import Header from '../../components/Header/Header'; // Importa el componente Header
import '../../components/Header/Header.css'; // Importa el CSS del Header

import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../estilos/comunidad/comunidad.css';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from '../../firebaseConfig';

function FormularioCrearComunidad() {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const db = getFirestore(app);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!nombre || !categoria || !descripcion || imageFiles.length === 0) {
      setError('Por favor, completa todos los campos y sube una imagen.');
      return;
    }

    setError('');
    try {
      const comunidadDoc = {
        nombre,
        categoria,
        descripcion,
        imagenURL: imageFiles[0].preview,
      };

      await addDoc(collection(db, "Comunidad"), comunidadDoc);
      setNombre('');
      setCategoria('');
      setDescripcion('');
      setImageFiles([]);
      alert('Comunidad creada correctamente');
    } catch (error) {
      setError('Error al crear la comunidad. Intenta de nuevo.');
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
      <Header /> {/* Agrega el encabezado aquí */}
      <div className="form-container">
        <h1>Crear Comunidad</h1>
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="nombre">Título:</label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              placeholder="Ej: Inteligencia Emocional"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
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
              <option value="educacion">Educación</option>
              <option value="salud">Salud</option>
              <option value="tecnologia">Tecnología</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción:</label>
            <textarea
              id="descripcion"
              className="form-control"
              placeholder="Escribe una breve descripción de la comunidad"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows="4"
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

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Error</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <FontAwesomeIcon icon={faExclamationCircle} size="3x" />
            <p className="mt-3">{error}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default FormularioCrearComunidad;
