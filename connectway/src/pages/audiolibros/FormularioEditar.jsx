import React, { useState } from 'react';
import './Formulario.css';
import Dropz from '../../components/Dropzone/Drop';  // Importamos el componente con las dropzones

function FormularioEditar() {
    const [titulo, setTitulo] = useState('');
    const [autor, setAutor] = useState('');
    const [categoria, setCategoria] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const handleCancel = () => {
        setTitulo('');
        setAutor('');
        setCategoria('');
        setDescripcion('');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log({ titulo, autor, categoria, descripcion });
    };

    return (
      <>
        <h1 className="title">Subir Audiolibro</h1>
        <form onSubmit={handleSubmit} className="form-container">
          <label htmlFor="titulo">Título:</label>
          <input
            type="text"
            id="titulo"
            placeholder="Ej: Inteligencia Emocional"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <label htmlFor="autor">Autor:</label>
          <input
            type="text"
            id="autor"
            placeholder="Ej: Daniel Goleman"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
          />

          <label htmlFor="categoria">Categoría:</label>
          <select
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Elegir categoría</option>
            <option value="autoestima">Autoestima</option>
            <option value="ansiedad">Ansiedad</option>
            <option value="depresion">Depresión</option>
            <option value="inteligencia_emocional">Inteligencia Emocional</option>
          </select>

          <label htmlFor="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            placeholder="Escribe una breve descripción del libro"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />

          {/* Aquí incluimos el componente FormAudiolibro que tiene las dropzones */}
          <Dropz />
        </form>
      </>
    );
}

export default FormularioEditar;
