import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/PaginaInicio/Navbar';
import '../../estilos/Audiolibros/AudiolibrosRegistrado.css';
import Contenedor from '../../components/Contenedor/Contenedor';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import AudiobookSearch2 from '../../components/BarraBuscador/BarraBuscador'; // Importar la barra de búsqueda

const AudiolibroUsuario = () => {
    const [audiolibros, setAudiolibros] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const maxItems = 3;

    const [searchPerformed, setSearchPerformed] = useState(false); // Indica si se realizó una búsqueda
    const [searchResults, setSearchResults] = useState([]); // Resultados de la búsqueda

    const rol = 0;
    const navigate = useNavigate();

    useEffect(() => {
        reloadAudiolibros();
    }, []);

    const reloadAudiolibros = async () => {
        const audiolibrosCollection = collection(db, 'Audiolibro');
        const audiolibrosSnapshot = await getDocs(audiolibrosCollection);
        const audiolibrosList = audiolibrosSnapshot.docs.map(doc => ({
            id: doc.id,
            imagenPortadaURL: doc.data().imagenPortadaURL, 
            titulo: doc.data().titulo,
            autor: doc.data().autor,
            categoria: doc.data().categoria,
            descripcion: doc.data().descripcion,
            duracion: doc.data().duracion,
            archivoAudioURL: doc.data().archivoAudioURL
        }));
        setAudiolibros(audiolibrosList);
    };

    const next = () => {
        if (currentIndex < getMaxIndex()) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const getMaxIndex = () => {
        if (searchPerformed) {
            return Math.max(searchResults.length - maxItems, 0);
        }
        return Math.max(audiolibros.length - maxItems, 0);
    };

    const handleContainerClick = (id) => {
        navigate(`/Audiolibros/registrados/informacion/${rol}`, { state: { idLibro: id } });
    };

    // Función para manejar los resultados de la búsqueda
    const handleSearchResults = useCallback((resultados) => {
        setSearchResults(resultados);
        setSearchPerformed(true); 
        setCurrentIndex(0); // Reiniciar el índice al realizar una búsqueda
    }, []);

    return (
        <div className="pagina-inicio">
            <Navbar />
            <div className="content">
                

                {/* Barra de búsqueda */}
                <AudiobookSearch2 onResults={handleSearchResults} setSearchPerformed={setSearchPerformed} />
                <div>
                    <p className='titulo-1'>Audiolibros recientes</p>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                    <button
                        className="btn"
                        onClick={prev}
                        disabled={currentIndex === 0}
                        style={{
                            fontSize: '3rem',
                            padding: '10px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: '#000',
                        }}
                    >
                        &lt;
                    </button>
                    <div className="d-flex justify-content-around flex-wrap" style={{ width: '80%' }}>
                        {searchPerformed ? (
                            searchResults.length === 0 ? (
                                <p>No encontramos resultados que coincidan con tu búsqueda. Intenta con términos diferentes o revisa la ortografía.</p>
                            ) : (
                                searchResults.slice(currentIndex, currentIndex + maxItems).map((libro, index) => (
                                    <Contenedor
                                        key={libro.id} // Cambié id por index
                                        imgPortada={libro.imagenPortadaUrl}
                                        titulo={libro.title}
                                        autor={libro.author}
                                        descripcion={libro.description}
                                        duracion={libro.duration}
                                        rol={rol}
                                        onEdit={null}
                                        onDelete={null}
                                        onClick={() => handleContainerClick(libro.id)}
                                    />
                                ))
                            )
                        ) : (
                            audiolibros.slice(currentIndex, currentIndex + maxItems).map((libro, index) => (
                                <Contenedor
                                    key={libro.id} // Cambié id por index
                                    imgPortada={libro.imagenPortadaURL}
                                    titulo={libro.titulo}
                                    autor={libro.autor}
                                    descripcion={libro.descripcion}
                                    duracion={libro.duracion}
                                    rol={rol}
                                    onEdit={null}
                                    onDelete={null}
                                    onClick={() => handleContainerClick(libro.id)}
                                />
                            ))
                        )}
                    </div>
                    <button
                        className="btn"
                        onClick={next}
                        disabled={currentIndex >= getMaxIndex()}
                        style={{
                            fontSize: '3rem',
                            paddingRight: '10px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: '#000',
                        }}
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AudiolibroUsuario;
