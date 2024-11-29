import React from 'react';
import '../../estilos/modal/modal.css';

const ModalNotificacion = ({ isOpen, onClose, type, message, iconClass }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className='title-modal'>{type === 'success' ? 'Realizado exitosamente' : 'Error'}</h2> 
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-divider" />
                <div className="modal-body">
                    <div className={`icon-container ${type}`}>
                        <i className={`fa ${iconClass}`}></i>
                    </div>
                    <p className="main-message">{type === 'success' ? '¡ÉXITO!' : '¡ERROR!'}</p> 
                    <p>{message}</p> 
                </div>
                {/*Añadi esto para el color del boton espero no afecte en nada */}
                <div className="modal-footer-noti">
                <button className="confirm-button"
                style={{backgroundColor: '#03314B', color: 'white', }}
                onClick={onClose}>
                Aceptar
                </button>
                 {/*Añadi esto para el color del boton espero no afecte en nada */}
                </div>
            </div>
        </div>
    );
};

export default ModalNotificacion;

