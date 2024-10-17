import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/PaginaInicio/Navbar';
import '../../estilos/Audiolibros/AudiolibrosRegistrado.css';
import Contenedor from '../../components/Contenedor/Contenedor';
import { db } from '../../firebaseConfig';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import ModalNotificacion from '../../components/Modal/ModalNotificacion';
import ModalConfirmacion from '../../components/Modal/ModalConfirmacion';
import { useNavigate } from 'react-router-dom';
import AudiobookSearch2 from '../../components/BarraBuscador/BarraBuscador'; // Importar la barra de búsqueda

const AudiolibroRegistrado = () => {
    const [audiolibros, setAudiolibros] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const maxItems = 3;

    const [isModalNotificacionOpen, setIsModalNotificacionOpen] = useState(false);
    const [notificationType, setNotificationType] = useState('success'); 
    const [notificationMessage, setNotificationMessage] = useState(''); 

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedLibro, setSelectedLibro] = useState(null); 
    const [searchPerformed, setSearchPerformed] = useState(false); // Indica si se realizó una búsqueda
    const [searchResults, setSearchResults] = useState([]); // Resultados de la búsqueda
    const rol = 1;
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
                console.error('Error al eliminar el audiolibro:', error);
                closeConfirmModal();
                showModalNotificacion('error', 'El audiolibro no se pudo eliminar correctamente.');
            }
        }
    };

    const handleEditAudiobook = (id) => {
        const selectedAudiobook = audiolibros.find(libro => libro.id === id);
        
        if (selectedAudiobook) {
            navigate('/Audiolibros/editar', { state: { audiobook: selectedAudiobook } });
        }
    };

    const handleContainerClick = (id) => {
        navigate(`/Audiolibros/registrados/informacion`, { state: { idLibro: id } });
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
                <div>
                    <h1 className='titulo-aud-reg'>Audiolibros Registrados</h1>
                </div>

                {/* Barra de búsqueda */}
                <AudiobookSearch2 onResults={handleSearchResults} setSearchPerformed={setSearchPerformed} />

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
                        {/* Mostrar resultados de la búsqueda o los audiolibros por defecto */}
                        {searchPerformed ? (
                            searchResults.length === 0 ? (
                                <p>No encontramos resultados que coincidan con tu búsqueda. Intenta con términos diferentes o revisa la ortografía.</p>
                            ) : (
                                searchResults.slice(currentIndex, currentIndex + maxItems).map((libro, index) => (
                                    <Contenedor
                                        key={libro.id}//cambié id por index
                                        imgPortada={libro.imagenPortadaUrl}
                                        titulo={libro.title}
                                        autor={libro.author}
                                        descripcion={libro.description}
                                        duracion={libro.duration}
                                        rol={rol}
                                        onEdit={() => handleEditAudiobook(libro.id)} 
                                        onDelete={() => openConfirmModal(libro)} 
                                        onClick={() => handleContainerClick(libro.id)}
                                    />
                                ))
                            )
                        ) : (
                            audiolibros.slice(currentIndex, currentIndex + maxItems).map((libro, index) => (
                                <Contenedor
                                    key={libro.id}//cambié id por index
                                    imgPortada={libro.imagenPortadaURL}
                                    titulo={libro.titulo}
                                    autor={libro.autor}
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
                description={`¿Estás seguro de que deseas eliminar el audiolibro?\nEsta acción es irreversible`}
                confirmButtonText="Eliminar"
                cancelButtonText="Cancelar"
                iconClass="fa fa-trash-alt"
            />
        </div>
    );
};

export default AudiolibroRegistrado;
