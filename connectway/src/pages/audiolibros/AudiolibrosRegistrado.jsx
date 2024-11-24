import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/PaginaInicio/Navbar';
import '../../estilos/Audiolibros/AudiolibrosRegistrado.css';
import Contenedor from '../../components/Contenedor/Contenedor';
import { db } from '../../firebaseConfig';
import { collection, getDocs, doc, deleteDoc, query, where } from 'firebase/firestore';
import ModalNotificacion from '../../components/Modal/ModalNotificacion';
import ModalConfirmacion from '../../components/Modal/ModalConfirmacion';
import { useNavigate } from 'react-router-dom';
import AudiobookSearch2 from '../../components/BarraBuscador/BarraBuscador'; 
import AudiolibrosReproducir from '../../pages/audiolibros/AudiolibrosReproducir';
import Categorias from '../../components/TarjetaCategoria/TarjetaCategoria';

const AudiolibroRegistrado = () => {
    const [audiolibros, setAudiolibros] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
    const [contadorPorCategoria, setContadorPorCategoria] = useState({});
    const [isModalNotificacionOpen, setIsModalNotificacionOpen] = useState(false);
    const [notificationType, setNotificationType] = useState('success'); 
    const [notificationMessage, setNotificationMessage] = useState(''); 
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedLibro, setSelectedLibro] = useState(null); 
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const maxItems = 3;
    const rol = 1;
    const navigate = useNavigate();

    const categoriasTar = [
        { id: 1, icono: <i className="fas fa-list"></i>, nombre: "Todos" },
        { id: 2, icono: <i className="fas fa-lightbulb"></i>, nombre: "Inteligencia Emocional" },
        { id: 3, icono: <i className="fas fa-user-tie"></i>, nombre: "Meditación" },
        { id: 4, icono: <i className="fas fa-users"></i>, nombre: "Psicología De Parejas" },
        { id: 5, icono: <i className="fas fa-brain"></i>, nombre: "Salud Mental" },
    ];
    const formatearCategoriaParaMostrar = (categoria) => {
        if (!categoria) return "Sin Categoría"; 
        return categoria
            .replace(/_/g, ' ') 
            .toLowerCase() 
            .replace(/(^|\s)\S/g, (letra) => letra.toUpperCase()); 
    };
    useEffect(() => {
        reloadAudiolibros();
        contarAudiolibrosPorCategoria(); // Llama a la función de conteo aquí
    }, [categoriaSeleccionada]);

    const formatearCategoria = (categoria) => categoria.toLowerCase().replace(/ /g, "_");

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

    const handleCategoriasClick = (nombre) => {
        setCategoriaSeleccionada(nombre);
        setSearchPerformed(false);
    };
    const handleContainerClick = (id) => 
    navigate(`/Audiolibros/registrados/informacion/${rol}`, 
    { state: { idLibro: id } });

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

    const showModalNotificacion = (type, message) => { 
        setNotificationType(type);
        setNotificationMessage(message); 
        setIsModalNotificacionOpen(true);
    };

    const closeModalNotificacion = async () => {
        await reloadAudiolibros(); 
        setIsModalNotificacionOpen(false);
    };

    const openConfirmModal = (libro) => {
        setSelectedLibro(libro);
        setIsConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        setIsConfirmModalOpen(false);
        setSelectedLibro(null);
    };

    const handleDelete = async () => {
        if (selectedLibro) {
            try {
                const audiolibroRef = doc(db, 'Audiolibro', selectedLibro.id);
                await deleteDoc(audiolibroRef);
                closeConfirmModal();
                showModalNotificacion('success', 'El audiolibro ha sido eliminado exitosamente.');
            } catch (error) {
                closeConfirmModal();
                showModalNotificacion('error', 'El audiolibro no se pudo eliminar correctamente.');
            }
        }
    };
    const handleEditAudiobook = (id) => {
        const selectedAudiobook = audiolibros.find(libro => libro.id === id);
        
        if (selectedAudiobook) {
            navigate('/Audiolibros/editar/1', { state: { audiobook: selectedAudiobook } });
        }
    };
    const handleSearchResults = useCallback((resultados) => {
        setSearchResults(resultados); 
        setSearchPerformed(true); 
        setCurrentIndex(0);
    }, []);


    
    return (
        <div className="pagina-inicio">
            <Navbar />
            <div className="content-audiolibro">
                <h1 className='titulo-aud-reg'>Audiolibros Registrados</h1>
                <AudiobookSearch2 onResults={handleSearchResults} setSearchPerformed={setSearchPerformed} />
                <div className="d-flex justify-content-between align-items-center">
                    <button className="btn" onClick={prev} disabled={currentIndex === 0}
                    style={{
                        fontSize: '3rem',
                        paddingRight: '10px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#000',
                    }}>&lt;</button>
                    <div className="d-flex justify-content-around flex-wrap" style={{ width: '80%'}}>
                        {searchPerformed ? (
                            searchResults.slice(currentIndex, currentIndex + maxItems).map((libro) => (
                                <Contenedor
                                    key={libro.id}
                                    imgPortada={libro.imagenPortadaUrl}
                                    titulo={libro.title}
                                    autor={libro.author}
                                    descripcion={libro.description}
                                    categoria={formatearCategoriaParaMostrar(libro.category)}
                                    duracion={libro.duration}
                                    rol={rol}
                                    onEdit={() => handleEditAudiobook(libro.id)} 
                                    onDelete={() => openConfirmModal(libro)} 
                                    onClick={() => handleContainerClick(libro.id)}
                                />
                            ))
                        ) : (
                            audiolibros.slice(currentIndex, currentIndex + maxItems).map((libro) => (
                                <Contenedor
                                    key={libro.id}
                                    imgPortada={libro.imagenPortadaURL}
                                    titulo={libro.titulo}
                                    autor={libro.autor}
                                    categoria={formatearCategoriaParaMostrar(libro.categoria)}
                                    descripcion={libro.descripcion}
                                    duracion={libro.duracion}
                                    rol={rol}
                                    onEdit={() => handleEditAudiobook(libro.id)} 
                                    onDelete={() => openConfirmModal(libro)} 
                                    onClick={() => handleContainerClick(libro.id)}
                                />
                            ))
                        )}
                    </div>
                    <button className="btn" onClick={next} disabled={currentIndex >= getMaxIndex()}
                    style={{
                        fontSize: '3rem',
                        paddingRight: '10px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#000',
                    }}>&gt;</button>
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
            <ModalNotificacion
                isOpen={isModalNotificacionOpen}
                onClose={closeModalNotificacion}
                type={notificationType}
                message={notificationMessage}
                iconClass={notificationType === 'success' ? 'fa fa-check' : 'fa fa-exclamation'}
            />
            <ModalConfirmacion 
                className="eliminar-accion"
                isOpen={isConfirmModalOpen}
                onClose={closeConfirmModal}
                onConfirm={handleDelete}
                title="Confirmar"
                description="¿Estás seguro de que deseas eliminar el audiolibro? Esta acción es irreversible"
                confirmButtonText="Eliminar"
                cancelButtonText="Cancelar"
                iconClass="fa fa-trash-alt"
            />
            <AudiolibrosReproducir/> 
        </div>
    );
};

export default AudiolibroRegistrado;
    