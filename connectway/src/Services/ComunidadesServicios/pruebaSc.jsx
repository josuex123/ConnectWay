import React, { useState } from 'react';
import { guardarSubComunidad } from './GuardarSubComunidad'; // Importa tu función
import {Comunidad} from '../Modelos/SubComunidad'


const SubComunidadForm = () => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivoPortada, setArchivoPortada] = useState(null);
  const tituloComunidad = "Meditacion"; // Título fijo de la categoría

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo || !descripcion || !archivoPortada) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    try {
      const subcomunidad = new Comunidad(null, titulo, tituloComunidad, descripcion, archivoPortada);
      await guardarSubComunidad(tituloComunidad, subcomunidad, subcomunidad.portadaUrl);
      alert("Subcomunidad guardada con éxito.");
    } catch (error) {
      console.error("Error al guardar la subcomunidad:", error);
      alert("Ocurrió un error al guardar la subcomunidad.");
    }
  };

  const handleFileChange = (e) => {
    setArchivoPortada(e.target.files[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="subcomunidad-form">
      <div>
        <label>Título de la subcomunidad:</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Descripción:</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Portada (imagen):</label>
        <input type="file" accept="image/*" onChange={handleFileChange} required />
      </div>

      <button type="submit">Guardar Subcomunidad</button>
    </form>
  );
};

export default SubComunidadForm;
