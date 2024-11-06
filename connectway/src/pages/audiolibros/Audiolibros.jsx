import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/PaginaInicio/Navbar';
import '../../estilos/Audiolibros/AudiolibrosRegistrado.css';
import Contenedor from '../../components/Contenedor/Contenedor';
import { db } from '../../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore'; // Importa `query` y `where`
import { useNavigate } from 'react-router-dom';
import AudiobookSearch2 from '../../components/BarraBuscador/BarraBuscador';
import Categorias from '../../components/TarjetaCategoria/TarjetaCategoria';
import '@fortawesome/fontawesome-free/css/all.min.css';

const AudiolibroUsuario = () => {
    const [audiolibros, setAudiolibros] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos"); 
    const maxItems = 3;

    const [searchPerformed, setSearchPerformed] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const rol = 0;
    const categoriasTar = [
        { id: 1, icono: <i className="fas fa-list"></i>, nombre: "Todos" },
        { id: 2, icono: <i className="fas fa-lightbulb"></i>, nombre: "Inteligencia Emocional" },
        { id: 3, icono: <i className="fas fa-user-tie"></i>, nombre: "Meditación" },
        { id: 4, icono: <i className="fas fa-users"></i>, nombre: "Psicologia De Parejas" },
        { id: 5, icono: <i className="fas fa-brain"></i>, nombre: "Salud Mental" },
    ];

    const navigate = useNavigate();

    useEffect(() => {
        reloadAudiolibros();
    }, [categoriaSeleccionada]); // Añadir dependencia para recargar cuando la categoría cambie

    const formatearCategoria = (categoria) => {
        return categoria.toLowerCase().replace(/ /g, "_");
    };

    const reloadAudiolibros = async () => {
        const audiolibrosCollection = collection(db, 'Audiolibro');
        
        // Aplica la conversión de categoría solo si no es "Todos"
        const audiolibrosQuery = categoriaSeleccionada === "Todos"
            ? audiolibrosCollection
            : query(audiolibrosCollection, where("categoria", "==", formatearCategoria(categoriaSeleccionada)));

        const audiolibrosSnapshot = await getDocs(audiolibrosQuery);
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
        return searchPerformed
            ? Math.max(searchResults.length - maxItems, 0)
            : Math.max(audiolibros.length - maxItems, 0);
    };

    const handleContainerClick = (id) => {
        navigate(`/Audiolibros/registrados/informacion/${rol}`, { state: { idLibro: id } });
    };

    const handleSearchResults = useCallback((resultados) => {
        setSearchResults(resultados);
        setSearchPerformed(true);
        setCurrentIndex(0);
    }, []);

    const handleCategoriasClick = (nombre) => {
        setCategoriaSeleccionada(nombre);
        setSearchPerformed(false); // Restablece la búsqueda al cambiar de categoría
    };

    return (
        <div className="pagina-inicio">
            <Navbar />
            <div className="content">
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
                                searchResults.slice(currentIndex, currentIndex + maxItems).map((libro) => (
                                    <Contenedor
                                        key={libro.id}
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
                            audiolibros.slice(currentIndex, currentIndex + maxItems).map((libro) => (
                                <Contenedor
                                    key={libro.id}
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
                <div className="contenedor-categoria"> 
                     <h4 className="titulo-cageoria">Categorias</h4>
                     <p className="texto-cageoria"> Explora nuestras categorias</p>
                    <div className="tarjetas-cat d-flex justify-content-between flex-wrap">
                        {categoriasTar.map((categoria) => (
                            <Categorias
                                key={categoria.id}
                                icono={categoria.icono}
                                nombreCategoria={categoria.nombre}
                                onClick={() => handleCategoriasClick(categoria.nombre)}
                                seleccionado={categoriaSeleccionada === categoria.nombre}
                            />
                        ))}
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default AudiolibroUsuario;
