import React from 'react';
import '../../estilos/contenedor/ContenedorComunidad.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ContenedorSubComunidad = ({ id, imgPortada, titulo, descripcion, idColeccion }) => {
    const navigate = useNavigate();

    const handleUnirse = () => {
        navigate('/comunidad/ver-comunidad', { state: { idComunidad: id, idColeccion: idColeccion} });
    };

    return (
        <div className="contenedor-comun card mb-4">
            <div className="card-body">
                <h5 className="card-title titulo-comun text-start"><strong>{titulo}</strong></h5>
                <img src={imgPortada} className="card-img-top img-portada-comun" alt="Portada" />
                <p className="descripcion-comun text-start">{descripcion}</p>

                <div className="d-flex justify-content-center gap-2 text-start mb-2">
                    <button className="btn btn-outline-secondary boton-ver" onClick={(e) => { e.stopPropagation(); handleUnirse(); }}>
                        Unirse
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContenedorSubComunidad;
