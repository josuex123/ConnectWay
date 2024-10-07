import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirigir
import { getAudiobooks } from './AudiolibrosListService';
import { getAudiobookId } from './EncontrarAudiolibroService';

const AudiobookList = () => {
    const [audiobooks, setAudiobooks] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Para usar la redirección

    useEffect(() => {
        const fetchAudiobooks = async () => {
            try {
                // Se trae la lista de todos los audiolibros
                const audiobooksData = await getAudiobooks();
                setAudiobooks(audiobooksData); // Se guarda la lista en el estado
            } catch (error) {
                console.error('Error fetching audiobooks:', error);
                setError('No se pudieron cargar los audiolibros.');
            }
        };

        fetchAudiobooks();
    }, []);

   // Función para manejar la edición de un audiolibro
    const handleEditAudiobook = async (id) => {
        try {
            const audiobook = await getAudiobookId(id);
            navigate('/FormularioEditar', { state: { audiobook } });
        } catch (error) {
            console.error('Error fetching audiobook:', error);
        }
    };

    return (
        <div className="audiobook-list">
            {error && <p>{error}</p>}
            {/* Mapeamos los audiolibros para mostrarlos */}
            {audiobooks.map(({ id, title, author, category, description, duration, created, updated, imagenPortadaUrl, archivoUrl }) => (
                <div key={id} className="audiobook">
                        <img 
                        src={imagenPortadaUrl}
                        alt={title}
                        onError={(e) => { e.target.onerror = null; e.target.src = 'ruta/a/imagen-alternativa.jpg'; }} 
                        width="300" height="300"
                    />
                    <h1>{title}</h1>
                    <p><strong>Autor:</strong> {author}</p>
                    <p><strong>Categoría:</strong> {category ? category.join(', ') : 'No disponible'}</p>
                    <p><strong>Descripción:</strong> {description}</p>
                    <p><strong>Duración:</strong> {duration} Minutos</p>                  


                    {/* Botón de editar que llama a la función para traer los datos y redirigir */}
                    <button onClick={() => handleEditAudiobook(id)}>Editar</button>
                    
                    <button>Eliminar</button>
                </div>
            ))}
        </div>
    );
};

export default AudiobookList;
