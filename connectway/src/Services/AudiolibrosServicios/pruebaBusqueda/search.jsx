import React, { useState, useEffect } from 'react';
import { buscarAudiolibro } from '../buscarAudiolibro'; // Importa la función de búsqueda desde Firebase
import Contenedor from '../../../components/Contenedor/Contenedor';


const AudiobookSearch = () => {
    const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda
    const [audiobooks, setAudiobooks] = useState([]); // Resultados de búsqueda

    // useEffect para ejecutar la búsqueda cada vez que el usuario escribe
    useEffect(() => {
        // Si el término de búsqueda no está vacío, hacer la búsqueda
        if (searchTerm !== '') {
            const fetchAudiobooks = async () => {
                const resultados = await buscarAudiolibro(searchTerm);
                setAudiobooks(resultados); // Guardar los resultados
            };
            fetchAudiobooks();
        } else {
            setAudiobooks([]); // Si no hay término, limpiar los resultados
        }
    }, [searchTerm]); // El efecto se ejecuta cada vez que cambia el término de búsqueda

    // Manejar el cambio en el input de búsqueda
    const handleSearch = (event) => {
        setSearchTerm(event.target.value); // Actualiza el término de búsqueda
    };

    const handleEdit = (id) => {
        // Lógica para editar
        console.log(`Editando audiolibro con id: ${id}`);
    };
    
    const handleDelete = (id) => {
        // Lógica para eliminar
        console.log(`Eliminando audiolibro con id: ${id}`);
    };
    

    return (
        <div>
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Buscar audiolibros..."
            />           
            <div className="resultados">
                {audiobooks.map((audiobook) => (
                    <Contenedor
                        key={audiobook.id}
                        //Usado el objeto Audiobook
                        imgPortada={audiobook.imagenPortadaUrl} // Imagen de portada
                        titulo={audiobook.title} // Título del audiolibro
                        autor={audiobook.author} // Autor del audiolibro
                        descripcion={audiobook.description} // Descripción del audiolibro
                        duracion={audiobook.duration} // Duración del audiolibro
                        id={audiobook.id} // ID del audiolibro
                        onEdit={() => handleEdit(audiobook.id)} // Manejo de edición
                        onDelete={() => handleDelete(audiobook.id)} // Manejo de eliminación
                    />
                ))}
            </div>

        </div>
    );
};

export default AudiobookSearch;
