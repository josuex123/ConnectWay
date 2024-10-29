import React from 'react';
import '../../estilos/contenedor/Contenedor.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Contenedor = ({ imgPortada, titulo, autor, descripcion, duracion, id, rol, onEdit, onDelete, onClick }) => { // Agregamos el prop rol
    const navigate = useNavigate();

    const handleEdit = () => {
        if (onEdit) {
            onEdit(id);
        } else {
            navigate('/Audiolibros/editar/1');
        }
    };

    return (
        <div className="contenedor card mb-4" onClick={onClick} style={{ cursor: 'pointer' }}>
            <img src={imgPortada} className="card-img-top img-portada" alt="Portada" />
            <div className="card-body">
                <h5 className="card-title titulo text-start"><strong>{titulo}</strong></h5>
                <p className="autor text-start">{autor}</p>
                <p className="descripcion text-start">{descripcion}</p>
                <p className="duracion text-start"><i className="fas fa-clock"></i> {duracion} minutos</p>
                {rol === 1 && (
                    <>
                        <div className="d-flex justify-content-center gap-2 text-start mb-2">
                            <i className="fas fa-edit icono-editar"></i>
                            <button className="btn btn-outline-secondary boton-editar" onClick={(e) => { e.stopPropagation(); handleEdit(); }}>
                                Editar
                            </button>
                        </div>
                        <div className="d-flex justify-content-center gap-2 text-start">
                            <i className="fas fa-trash-alt icono-eliminar"></i>
                            <button disabled={true} className="btn btn-outline-danger elim" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
                                Eliminar
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Contenedor;
