import React from 'react';
import '../../estilos/contenedor/Contenedor.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css'; 

const Contenedor = ({ imgPortada, titulo, autor, descripcion, duracion, id, onEdit, onDelete }) => {
    const navigate = useNavigate(); 

    const handleEdit = () => {
        if (onEdit) {
            onEdit(id); 
        } else {
            navigate('/Audiolibros/editar'); 
        }
    };

    return (
        <div className="contenedor card mb-4">
            <img src={imgPortada} className="card-img-top img-portada" alt="Portada" />
            <div className="card-body">
                <h5 className="card-title titulo text-start">{titulo}</h5>
                <p className="autor text-start"><strong>Autor:</strong> {autor}</p>
                <p className="descripcion text-start"><strong>Descripción:</strong> {descripcion}</p>
                <p className="duracion text-start"><i className="fas fa-clock"></i> {duracion} minutos</p>
                <div className="d-flex align-items-center gap-2 text-start mb-2">
                    <i className="fas fa-edit icono-editar"></i> 
                    <button className="btn btn-outline-secondary boton-editar" onClick={handleEdit}>
                        Editar
                    </button>
                </div>
                <div className="d-flex align-items-center gap-2 text-start">
                    <i className="fas fa-trash-alt icono-eliminar"></i> 
                    <button className="btn btn-outline-danger boton-eliminar" onClick={onDelete}>
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Contenedor;
