import React, { useState } from 'react';
import './Formulario.css';

function Formulario() {
    const [titulo, setTitulo] = useState('');
    const [autor, setAutor] = useState('');
    const [categoria, setCategoria] = useState('');
    const [descripcion, setDescripcion] = useState('');
  
    const handleCancel = () => {
      // Reiniciar los campos
      setTitulo('');
      setAutor('');
      setCategoria('');
      setDescripcion('');
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      // Aquí puedes manejar lo que suceda al enviar el formulario
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
            <option value="novela">Autoestima</option>
            <option value="ensayo">Ansiedad</option>
            <option value="biografia">Depresion</option>
            <option value="educativo">Inteligencia Emocional</option>
          </select>
  
            <label htmlFor="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            placeholder="Escribe una breve descripción del libro"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
  
          <div className="file-upload-container">
            <div className="file-upload-field">
              <label htmlFor="imagen">Subir imagen:</label>
              <input
                type="file"
                id="imagen"
                accept="image/*"
                className="upload-field"
              />
            </div>
            <div className="file-upload-field">
              <label htmlFor="audiolibro">Subir Audiolibro:</label>
              <input
                type="file"
                id="audiolibro"
                accept="audio/*"
                className="upload-field"
              />
            </div>
          </div>
        </form>
      </>
    );
  }
  
  
export default Formulario