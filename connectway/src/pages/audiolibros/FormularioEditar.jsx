import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateAudiobook } from '../../Services/AudiolibrosServicios/UpdateAudiobook';
import '../../estilos/Audiolibros/FormularioEditar/Formulario.css';
import EditMediaDrop from '../../components/Dropzone/EditMediaDrop';

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

    useEffect(() => {
        if (audiobook) {
            setTitulo(audiobook.titulo || '');
            setAutor(audiobook.autor || '');
            setCategoria(audiobook.categoria || '');
            setDescripcion(audiobook.descripcion || '');
            setImagenUrl(audiobook.imagenPortadaUrl || '');
            setAudioUrl(audiobook.archivoUrl || '');
        }
    }, [audiobook]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const updatedData = {
            title: titulo,
            author: autor,
            category: categoria,
            description: descripcion,
            imagenPortadaUrl: imagenUrl,
            archivoUrl: audioUrl,
        };

        try {
            await updateAudiobook(audiobook.id, updatedData); 
            navigate('/Audiolibros/registrados'); 
        } catch (error) {
            console.error('Error al actualizar el audiolibro: ', error);
        }
    };

    return (
        <div className="audiobook-edit-page">
            <h1>Editar Aiolibro</h1>
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
                </select>

                <label htmlFor="descripcion">Descripción:</label>
                <textarea
                    id="descripcion"
                    placeholder="Descripción"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />

                <EditMediaDrop
                    initialImageUrl={imagenUrl}
                    initialAudioUrl={audioUrl}
                    onImageChange={setImagenUrl}
                    onAudioChange={setAudioUrl}
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
