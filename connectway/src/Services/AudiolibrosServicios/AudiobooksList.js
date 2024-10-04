import React, { useEffect, useState } from 'react';
import { getAudiobooks } from './AudiolibrosListService';
import { getAudiobookId } from './EncontrarAudiolibroService';

const AudiobookList = () => {
    const [audiobooks, setAudiobooks] = useState([]);
    const [error, setError] = useState(null);
    const IMAGE_FALLBACK = 'ruta/a/imagen-alternativa.jpg'; // Ruta de imagen alternativa

    useEffect(() => {
        const fetchAudiobooks = async () => {
            try {
                const audiobooksData = await getAudiobooks();
                setAudiobooks(audiobooksData);
            } catch (error) {
                console.error('Error fetching audiobooks:', error);
                setError('No se pudieron cargar los audiolibros.'); // Mensaje de error
            }
        };

        fetchAudiobooks();
    }, []);

    const convertTimestamp = (timestamp) => {
        if (!timestamp) return 'Fecha no disponible';
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleString();
    };

    return (
        <div className="audiobook-list">
            {error && <p>{error}</p>} {/* Mensaje de error */}
            {audiobooks.map(({ id, title, author, category, description, duration, created, updated, imagenPortadaUrl, archivoUrl }) => (
                <div key={id} className="audiobook">
                    <h1>{title}</h1>
                    <p><strong>Autor:</strong> {author}</p>
                    <p><strong>Categoría:</strong> {category ? category.join(', ') : 'No disponible'}</p>
                    <p><strong>Descripción:</strong> {description}</p>
                    <p><strong>Duración:</strong> {duration} horas</p>
                    <p><strong>Creado en:</strong> {convertTimestamp(created)}</p>
                    <p><strong>Actualizado en:</strong> {convertTimestamp(updated)}</p>
                    <img 
                        src={imagenPortadaUrl}
                        
                        alt={title} 
                        onError={(e) => { e.target.onerror = null; e.target.src = IMAGE_FALLBACK; }} 
                        width="300" height="300"
                    />
                    <audio controls>
                        <source src={archivoUrl} type="audio/mpeg" />
                        Tu navegador no soporta el elemento de audio.
                    </audio>
                    <button onClick={() => console.log(id)}>Press</button>
                </div>
            ))}
        </div>
    );
};

export default AudiobookList;
