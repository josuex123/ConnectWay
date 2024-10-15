import React, { useState, useCallback } from 'react';
import AudiobookSearch2 from './BarraBuscador';
import Contenedor from '../../../components/Contenedor/Contenedor';

const AudiobookPage = () => {
    const [audiobooks, setAudiobooks] = useState([]); // Guardar los resultados
    const [searchPerformed, setSearchPerformed] = useState(false); // Indica si se realizó una búsqueda

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
            <AudiobookSearch2 onResults={handleResults} setSearchPerformed={setSearchPerformed} />
            <div className="resultados">
                {searchPerformed && audiobooks.length === 0 ? (
                    <p>Lo siento, no encontramos resultados que coincidan con tu búsqueda. Intenta con términos diferentes o revisa la ortografía.</p>
                ) : (
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
                )}
            </div>
        </div>
    );
};

export default AudiobookPage;
