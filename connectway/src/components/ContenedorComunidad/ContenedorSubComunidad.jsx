import React from 'react';
import '../../estilos/contenedor/ContenedorComunidad.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { unirseComunidad } from '../../Services/ComunidadesServicios/UnirseComunidad';

const ContenedorSubComunidad = ({ id, imgPortada, titulo, descripcion, idColeccion, categoria, estadoBoton }) => {
    const navigate = useNavigate();

    const handleClick = async () => {
        const datosComunidad = {
            idComunidad: id,
            idColeccion: idColeccion,
            categoria: categoria || 'Categoría no disponible',
        };

        if (estadoBoton === 'Unirse') {
            console.log("Desde el botón unirse: " + id + " " + idColeccion);
            const correoUsuario = sessionStorage.getItem('correoUsuario');
            const username = sessionStorage.getItem('nombreUsuario');

            try {
                await unirseComunidad(id, idColeccion, correoUsuario, username);
                console.log("Unido exitosamente a la comunidad");
            } catch (error) {
                console.error("Error al unirse a la comunidad:", error);
                return; // Detener la navegación si ocurre un error
            }
        }

        // Redirigir después de completar la lógica
        navigate('/comunidad/ver-comunidad', { state: datosComunidad });
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
        </div>
    );
};

export default ContenedorSubComunidad;
