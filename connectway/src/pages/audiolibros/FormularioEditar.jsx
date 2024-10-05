import React, { useState, useEffect } from 'react'; 
import { useLocation } from 'react-router-dom';
import './Formulario.css';

const AudiobookEdit = () => {
    const location = useLocation();
    const { audiobook } = location.state || {};  // Extraer los datos del audiolibro de la ubicación

    const [titulo, setTitulo] = useState('');
    const [autor, setAutor] = useState('');
    const [categoria, setCategoria] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imagenUrl, setImagenUrl] = useState(''); 
    const [audioUrl, setAudioUrl] = useState('');

    // Cargar los datos del audiolibro cuando estén disponibles
    useEffect(() => {
        if (audiobook) {
            setTitulo(audiobook._title || '');
            setAutor(audiobook._author || ''); 
            setCategoria(audiobook._category || '');
            setDescripcion(audiobook._description || '');
            setImagenUrl(audiobook._imageUrl || ''); 
            setAudioUrl(audiobook._audioUrl || ''); 
        }
    }, [audiobook]);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Implementar la logica para editar
    };

    return (
        <div className="audiobook-edit-page">
            <h1>Editar Audiolibro</h1>
            <form onSubmit={handleSubmit} className="form-container">
                <label htmlFor="titulo">Título:</label>
                <input
                    type="text"
                    id="titulo"
                    placeholder="Título"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                />

                <label htmlFor="autor">Autor:</label>
                <input
                    type="text"
                    id="autor"
                    placeholder="Autor"
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
                    {/* Añadir más opciones según tus necesidades */}
                </select>

                <label htmlFor="descripcion">Descripción:</label>
                <textarea
                    id="descripcion"
                    placeholder="Descripción"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />

                <div className="form-buttons">
                    <button type="submit">Guardar cambios</button>
                    <button type="button" onClick={() => window.history.back()}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default AudiobookEdit;

