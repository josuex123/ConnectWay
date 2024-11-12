import React from 'react';
import '../../estilos/modal/modal.css';

const ModalCargando = ({ isOpen, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className='title-modal'>Cargando</h2> 
                </div>
                <div className="modal-divider" />
                <div className="modal-body">
                    <div className="icon-container loading">
                        <i className="fa fa-spinner fa-spin"></i>
                    </div>
                    <p className="main-message">Por favor espera.<br/> {message}</p>
                </div>
            </div>
        </div>
    );
};

export default ModalCargando;
