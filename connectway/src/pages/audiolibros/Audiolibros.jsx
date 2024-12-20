import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/PaginaInicio/Navbar';
import '../../estilos/Audiolibros/AudiolibrosRegistrado.css';
import Contenedor from '../../components/Contenedor/Contenedor';
import { db } from '../../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore'; 
import { useNavigate } from 'react-router-dom';
import AudiobookSearch2 from '../../components/BarraBuscador/BarraBuscador';
import Categorias from '../../components/TarjetaCategoria/TarjetaCategoria';
import '@fortawesome/fontawesome-free/css/all.min.css';

const AudiolibroUsuario = () => {
    const [audiolibros, setAudiolibros] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [contadorPorCategoria, setContadorPorCategoria] = useState({});

    const maxItems = 3;
    const rol = 0;
    
    const categoriasTar = [
        { id: 1, icono: <i className="fas fa-list"></i>, nombre: "Todos" },
        { id: 2, icono: <i className="fas fa-lightbulb"></i>, nombre: "Inteligencia Emocional" },
        { id: 3, icono: <i className="fas fa-user-tie"></i>, nombre: "Meditación" },
        { id: 4, icono: <i className="fas fa-users"></i>, nombre: "Psicología De Parejas" },
        { id: 5, icono: <i className="fas fa-brain"></i>, nombre: "Salud Mental" },
    ];

    const navigate = useNavigate();

    useEffect(() => {
        reloadAudiolibros();
        contarAudiolibrosPorCategoria();
    }, [categoriaSeleccionada]);

    const formatearCategoria = (categoria) => categoria.toLowerCase().replace(/ /g, "_");

    const formatearCategoriaParaMostrar = (categoria) => {
        if (!categoria) return "Sin Categoría"; 
        return categoria
            .replace(/_/g, ' ') 
            .toLowerCase() 
            .replace(/(^|\s)\S/g, (letra) => letra.toUpperCase()); 
    };

    const reloadAudiolibros = async () => {
        const audiolibrosCollection = collection(db, 'Audiolibro');
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
    
        audiolibrosList.sort((a, b) => a.titulo.localeCompare(b.titulo));
        setAudiolibros(audiolibrosList);
    };

    const contarAudiolibrosPorCategoria = async () => {
        const conteo = {};

        for (const categoria of categoriasTar) {
            const nombreCategoria = formatearCategoria(categoria.nombre);
            const audiolibrosCollection = collection(db, 'Audiolibro');
            const audiolibrosQuery = nombreCategoria === "todos"
                ? audiolibrosCollection
                : query(audiolibrosCollection, where("categoria", "==", nombreCategoria));
            
            const audiolibrosSnapshot = await getDocs(audiolibrosQuery);
            conteo[categoria.nombre] = audiolibrosSnapshot.size; // Guarda el conteo para cada categoría
        }

        setContadorPorCategoria(conteo); // Actualiza el estado con el conteo de cada categoría
    };

    const next = () => {
        if (currentIndex < getMaxIndex()) setCurrentIndex(currentIndex + 1);
    };

    const prev = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };

    const getMaxIndex = () => searchPerformed ? Math.max(searchResults.length - maxItems, 0) : Math.max(audiolibros.length - maxItems, 0);

    const handleContainerClick = (id) => navigate(`/Audiolibros/registrados/informacion/${rol}`, { state: { idLibro: id } });

    const handleSearchResults = useCallback((resultados) => {
        setSearchResults(resultados);
        setSearchPerformed(true);
        setCurrentIndex(0);
    }, []);

    const handleCategoriasClick = (nombre) => {
        setCategoriaSeleccionada(nombre);
        setSearchPerformed(false);
    };

    return (
        <div className="pagina-inicio">
            <Navbar />
            <div className="content-audiolibro"> 
                <AudiobookSearch2 onResults={handleSearchResults} setSearchPerformed={setSearchPerformed} />
                <div>
                    <p className='titulo-1'>
                        {categoriaSeleccionada === "Todos" ? "Audiolibros recientes" : `Categoría: ${categoriaSeleccionada}`}
                    </p>
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
                                <p>No encontramos resultados que coincidan con tu búsqueda.</p>
                            ) : (
                                searchResults.slice(currentIndex, currentIndex + maxItems).map((libro) => (
                                    <Contenedor
                                        key={libro.id}
                                        imgPortada={libro.imagenPortadaURL}
                                        titulo={libro.titulo}
                                        autor={libro.autor}
                                        descripcion={libro.descripcion}
                                        duracion={libro.duracion}
                                        categoria={formatearCategoriaParaMostrar(libro.categoria)}
                                        rol={rol}
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
                                    categoria={formatearCategoriaParaMostrar(libro.categoria)}
                                    rol={rol}
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
                    <h4 className="titulo-categoria">Categorías</h4>
                    <p className="texto-categoria">Explora nuestras categorías</p>
                    <div className="tarjetas-cat d-flex justify-content-between flex-wrap">
                        {categoriasTar.map((categoria) => (
                            <Categorias
                                key={categoria.id}
                                icono={categoria.icono}
                                nombreCategoria={`${categoria.nombre} (${contadorPorCategoria[categoria.nombre] || 0})`}
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
