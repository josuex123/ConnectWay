// AudiobookPage.js
import React, { useState, useCallback } from 'react';
import AudiobookSearch2 from './BarraBuscador';
import Contenedor from '../../../components/Contenedor/Contenedor';

const AudiobookPage = () => {
    const [audiobooks, setAudiobooks] = useState([]); // Guardar los resultados

    // Usar useCallback para evitar que handleResults se recree en cada render
    const handleResults = useCallback((resultados) => {
        setAudiobooks(resultados); // Actualizar los audiolibros
    }, []);

    const handleEdit = (id) => {
        console.log(`Editando audiolibro con id: ${id}`);
    };
    
    const handleDelete = (id) => {
        console.log(`Eliminando audiolibro con id: ${id}`);
    };

    return (
        <div>
            <AudiobookSearch2 onResults={handleResults} />
            <div className="resultados">
                {audiobooks.length > 0 ? (
                    audiobooks.map((audiobook) => (
                        <Contenedor
                            key={audiobook.id}
                            imgPortada={audiobook.imagenPortadaUrl}
                            titulo={audiobook.title}
                            autor={audiobook.author}
                            descripcion={audiobook.description}
                            duracion={audiobook.duration}
                            id={audiobook.id}
                            onEdit={() => handleEdit(audiobook.id)}
                            onDelete={() => handleDelete(audiobook.id)}
                        />
                    ))
                ) : (
                    <p>No se encontraron audiolibros.</p>
                )}
            </div>
        </div>
    );
};

export default AudiobookPage;
