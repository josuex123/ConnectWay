import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Agregar useNavigate
import { updateAudiobook } from '../../Services/AudiolibrosServicios/UpdateAudiobook';
import '../../estilos/Audiolibros/FormularioEditar/Formulario.css';
import EditMediaDrop from '../../components/Dropzone/EditMediaDrop'; // Ruta correcta

const AudiobookEdit = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Inicializar useNavigate
    const { audiobook } = location.state || {}; // Extraer los datos del audiolibro de la ubicación

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
            setImagenUrl(audiobook._imagenPortadaUrl || '');
            setAudioUrl(audiobook._archivoUrl || '');
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
    
        // Imprimir en consola los datos que se van a actualizar
        console.log('Datos a actualizar:', updatedData);
    
        try {
            // Llamar a la función para actualizar el audiolibro
            await updateAudiobook(audiobook._id, updatedData); // Actualizar audiolibro
            console.log('Audiolibro actualizado correctamente');
    
            // Redirigir a la página deseada después de la actualización
            navigate('/Audiolibros/registrados'); // Cambia '/ruta-deseada' por la ruta a la que quieres redirigir
        } catch (error) {
            console.error('Error al actualizar el audiolibro: ', error);
            // Manejo del error, como mostrar un mensaje de error al usuario
        }
    };
    

    return (
        <div className="audiobook-edit-page">
            <h1>Editar Audiolibro</h1>
            <h1>{imagenUrl}</h1>
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

                {/* Componente para editar la imagen y el audio */}
                <EditMediaDrop
                    initialImageUrl={imagenUrl}  // Corregido aquí
                    initialAudioUrl={audioUrl}   // Aquí está correcto
                    onImageChange={setImagenUrl}  // Actualiza la URL de la imagen
                    onAudioChange={setAudioUrl}   // Actualiza la URL del audio
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
