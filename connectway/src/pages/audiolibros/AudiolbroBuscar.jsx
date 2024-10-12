import React, { useState, useEffect } from 'react';
import { buscarAudiolibro } from '../../Services/AudiolibrosServicios/buscarAudiolibro'; // Importa la función de búsqueda desde Firebase
import Contenedor from '../../components/Contenedor/Contenedor';
import '../../estilos/Audiolibros/AudiobookSearch.css';
import Navbar from '../../components/PaginaInicio/Navbar';

const AudiobookSearch = () => {
    const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda
    const [audiobooks, setAudiobooks] = useState([]); // Resultados de búsqueda

    // useEffect para ejecutar la búsqueda cada vez que el usuario escribe
    useEffect(() => {
        if (searchTerm !== '') {
            const fetchAudiobooks = async () => {
                const resultados = await buscarAudiolibro(searchTerm);
                setAudiobooks(resultados); // Guardar los resultados
            };
            fetchAudiobooks();
        } else {
            setAudiobooks([]); // Si no hay término, limpiar los resultados
        }
    }, [searchTerm]);

    // Manejar el cambio en el input de búsqueda
    const handleSearch = (event) => {
        setSearchTerm(event.target.value); // Actualiza el término de búsqueda
    };

    const handleEdit = (id) => {
        console.log(`Editando audiolibro con id: ${id}`);
    };
    
    const handleDelete = (id) => {
        console.log(`Eliminando audiolibro con id: ${id}`);
    };

    return (
        <div className='pagina-inicio'> 
             <Navbar />
        
            <div className="search-container">        
                <div className="search-bar">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Escribir título"
                    />
                    <button className="search-button">
                        <i className="fa fa-search"></i>
                    </button>
                </div>
                <div className="resultados">
                    {audiobooks.map((audiobook) => (
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
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AudiobookSearch;
