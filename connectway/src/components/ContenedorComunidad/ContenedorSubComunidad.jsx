import React, { useState } from 'react';
import '../../estilos/contenedor/ContenedorComunidad.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ModalNotificacion from '../../components/Modal/ModalNotificacion';
import { unirseComunidad } from '../../Services/ComunidadesServicios/UnirseComunidad';

const ContenedorSubComunidad = ({ id, imgPortada, titulo, descripcion, idColeccion, categoria, estadoBoton }) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('success');

      
    const handleModalClose = () => {
        setIsModalOpen(false);
        navigate('/comunidad/ver-comunidad', {
            state: {
                idComunidad: id,
                idColeccion: idColeccion,
                categoria: categoria || 'Categoría no disponible',
            },
        });
    };

    const handleClick = async () => {
        if (estadoBoton === 'Unirse') {
            console.log("Desde el botón unirse: " + id + " " + idColeccion);
            const correoUsuario = sessionStorage.getItem('correoUsuario');
            const username = sessionStorage.getItem('nombreUsuario');

            try {
                await unirseComunidad(id, idColeccion, correoUsuario, username);
                console.log("Unido exitosamente a la comunidad");
                setModalType('success');
                setModalMessage('Te has unido exitosamente a la comunidad.');
                setIsModalOpen(true);
                //Modal por 3seg
                setTimeout(() => {
                    setIsModalOpen(false);
                    handleModalClose();
                }, 3000);
            } catch (error) {
                console.error("Error al unirse a la comunidad:", error);
                setModalType('error');
                setModalMessage('Hubo un error al intentar unirte a la comunidad.');
                setIsModalOpen(true);
            }
        }else{
            navigate('/comunidad/ver-comunidad', {
                state: {
                    idComunidad: id,
                    idColeccion: idColeccion,
                    categoria: categoria || 'Categoría no disponible',
                },
            });
        }
    };

    return (
        <div className="contenedor-comun card mb-4">
            <div className="card-body">
                <h5 className="card-title titulo-comun text-start"><strong>{titulo}</strong></h5>
                <img src={imgPortada} className="card-img-top img-portada-comun" alt="Portada" />
                <p className="descripcion-comun text-start">{descripcion}</p>

                <div className="d-flex justify-content-center gap-2 text-start mb-2">
                    <button
                        className="btn btn-outline-secondary boton-ver"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClick();
                        }}
                    >
                        {estadoBoton}  {/* Muestra el texto del botón basado en el estado */}
                    </button>
                </div>
            </div>

            {/* Modal de notificación */}
            <ModalNotificacion
                isOpen={isModalOpen}
                onClose={handleModalClose}
                type={modalType}
                message={modalMessage}
                iconClass={modalType === 'success' ? 'fa-check-circle' : 'fa-times-circle'}
            />
        </div>
    );
};

export default ContenedorSubComunidad;
