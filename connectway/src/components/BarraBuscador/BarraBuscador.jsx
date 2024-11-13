import React, { useState, useEffect } from 'react';
import { buscarAudiolibro } from '../../Services/AudiolibrosServicios/buscarAudiolibro';
import '../../estilos/BarraBusqueda/AudiobookSearch.css';

const AudiobookSearch2 = ({ onResults, setSearchPerformed }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Expresión regular para validar solo letras, números y espacios
    const isValidTerm = (term) => /^[a-zA-ZÀ-ÿ0-9\s]*$/.test(term);

    // useEffect para ejecutar la búsqueda cada vez que el usuario escribe
    useEffect(() => {
        if (searchTerm.trim() !== '' && searchTerm.length > 2 && searchTerm.length <= 100) {
            if (isValidTerm(searchTerm)) {
                const fetchAudiobooks = async () => {
                    const resultados = await buscarAudiolibro(searchTerm);
                    onResults(resultados);
                    setSearchPerformed(true);
                    setErrorMessage(''); // Limpiar el mensaje de error si es válido
                };
                fetchAudiobooks();
            } else {
                onResults([]);
                setSearchPerformed(false);
                setErrorMessage('Caracter no válido. Solo se permiten letras, números y espacios.');
            }
        } else if (searchTerm.length > 100) {
            onResults([]);
            setSearchPerformed(false);
            setErrorMessage('Has alcanzado el límite máximo de 100 caracteres.');
        } else {
            onResults([]);
            setSearchPerformed(false);
            setErrorMessage(''); // Limpiar el mensaje de error si no hay término
        }
    }, [searchTerm, onResults, setSearchPerformed]);

    // Manejar el cambio en el input de búsqueda
    const handleSearch = (event) => {
        const newValue = event.target.value;

        // Si se supera los 100 caracteres, no permitira más escritura y mostrar error
        if (newValue.length <= 100) {
            setSearchTerm(newValue);
        } else {
            setErrorMessage('Has alcanzado el límite máximo de 100 caracteres.');
        }
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
                {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Mostrar el mensaje de error */}
            </div>
        </div>
    );
};

export default AudiobookSearch2;
