import React, { useState, useEffect } from 'react';
import Navbar from '../../components/PaginaInicio/Navbar';
import '../../estilos/Audiolibros/AudiolibrosRegistrado.css';
import Contenedor from '../../components/Contenedor/Contenedor';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import ModalNotificacion from '../../components/Modal/ModalNotificacion';
import ModalConfirmacion from '../../components/Modal/ModalConfirmacion';

const AudiolibroRegistrado = () => {
    const [audiolibros, setAudiolibros] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const maxItems = 3;

    const [isModalNotificacionOpen, setIsModalNotificacionOpen] = useState(false);
    const [notificationType, setNotificationType] = useState('success'); 
    const [notificationMessage, setNotificationMessage] = useState(''); 

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedLibro, setSelectedLibro] = useState(null); 

    useEffect(() => {
        const fetchAudiolibros = async () => {
            const audiolibrosCollection = collection(db, 'Audiolibro');
            const audiolibrosSnapshot = await getDocs(audiolibrosCollection);
            const audiolibrosList = audiolibrosSnapshot.docs.map(doc => ({
                imagenPortadaURL: doc.data().imagenPortadaURL,
                titulo: doc.data().titulo,
                autor: doc.data().autor,
                descripcion: doc.data().descripcion,
                duracion: doc.data().duracion,
            }));
            setAudiolibros(audiolibrosList);
        };

        fetchAudiolibros();
    }, []);

    const next = () => {
        if (currentIndex < audiolibros.length - maxItems) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const showModalNotificacion = (type, message) => { 
        setNotificationType(type);
        setNotificationMessage(message); 
        setIsModalNotificacionOpen(true);
    };

    const closeModalNotificacion = () => {
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

    const handleDelete = () => {
        if (selectedLibro) {
            // logica eliminar
            const isDeletedSuccessfully = true; 
    
            if (isDeletedSuccessfully) {
                closeConfirmModal();
                showModalNotificacion('success', 'El audiolibro ha sido eliminado exitosamente.');
            } else {
                closeConfirmModal();
                showModalNotificacion('error', 'El audiolibro no se pudo eliminar correctamente.');
            }
        }
    };

    return (
        <div className="pagina-inicio">
            <Navbar />
            <div className="content">
                <div>
                    <h1 className='titulo-aud-reg'>Audiolibros registrados</h1>
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
                        {audiolibros.slice(currentIndex, currentIndex + maxItems).map((libro, index) => (
                            <Contenedor
                                key={index}
                                imgPortada={libro.imagenPortadaURL}
                                titulo={libro.titulo}
                                autor={libro.autor}
                                descripcion={libro.descripcion}
                                duracion={libro.duracion}
                                onDelete={() => openConfirmModal(libro)} 
                            />
                        ))}
                    </div>
                    <button
                        className="btn"
                        onClick={next}
                        disabled={currentIndex >= audiolibros.length - maxItems}
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
                iconClass={notificationType === '!success' ? 'fa fa-check' : 'fa fa-exclamation'}
            />
            <ModalConfirmacion
                isOpen={isConfirmModalOpen}
                onClose={closeConfirmModal}
                onConfirm={handleDelete}
                title="Confirmar"
                description={`¿Estás seguro de que deseas eliminar el audiolibro?`}
                iconClass="fa fa-trash"
            />
        </div>
    );
};

export default AudiolibroRegistrado;
