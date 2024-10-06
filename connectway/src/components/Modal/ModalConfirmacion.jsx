import React from 'react';
import '../../estilos/modal/modal.css';

const ModalConfirmacion = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    description, 
    confirmButtonText = 'Aceptar', 
    cancelButtonText = 'Cancelar', 
    iconClass 
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className='title-modal'>{title}</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-divider" />
                <div className="modal-body">
                    {iconClass && (
                        <div className="icon-container">
                            <i className={`fa ${iconClass}`}></i>
                        </div>
                    )}
                    <p>{description}</p>
                </div>
                <div className="modal-footer">
                    <button className="cancel-button" onClick={onClose}>{cancelButtonText}</button>
                    <button className="confirm-button" onClick={onConfirm}>{confirmButtonText}</button>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirmacion;
