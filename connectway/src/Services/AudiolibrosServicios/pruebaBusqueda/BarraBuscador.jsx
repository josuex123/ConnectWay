import React, { useState, useEffect } from 'react';
import { buscarAudiolibro } from '../buscarAudiolibro'; // Importa la función de búsqueda desde Firebase

const AudiobookSearch2 = ({ onResults, setSearchPerformed }) => {
    const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda

    // useEffect para ejecutar la búsqueda cada vez que el usuario escribe
    useEffect(() => {
        if (searchTerm.trim() !== '' && searchTerm.length > 2) { // Verifica si el término no es solo espacios en blanco
            const fetchAudiobooks = async () => {
                const resultados = await buscarAudiolibro(searchTerm);
                onResults(resultados); // Pasar los resultados al componente padre
                setSearchPerformed(true); // Indica que se realizó una búsqueda
            };
            fetchAudiobooks();
        } else {
            onResults([]); // Si no hay término, limpiar los resultados
            setSearchPerformed(false); // No se realizó una búsqueda válida
        }
    }, [searchTerm, onResults, setSearchPerformed]);

    // Manejar el cambio en el input de búsqueda
    const handleSearch = (event) => {
        setSearchTerm(event.target.value); // Actualiza el término de búsqueda
    };

    return (
        <div className='pagina-inicio'> 
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
            </div>
        </div>
    );
};

export default AudiobookSearch2;
