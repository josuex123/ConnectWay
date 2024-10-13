import React from 'react';
import '../../estilos/Audiolibros/AudiolibrosInformacion/AudiolibrosInformacion.css'
import NoContentPage from '../noContent/noContentPage'
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import NavBar from "../../components/PaginaInicio/Navbar";




const AudiolibrosInformacion = () => {
    const location = useLocation();
    const { idLibro } = location.state || {};

    useEffect(() => {
        if (idLibro) {
        }
    }, [idLibro]);
    return (
        <div className="pagina-inicio">
            <NavBar/>
            <div className="content">
            <h1>Información del Audiolibro</h1>
            {idLibro ? (
                <p>ID del Audiolibro: {idLibro}</p>
            ) : (
                <p>No se ha proporcionado una ID del audiolibro.</p>
            )}
            </div>
        </div>
    );
};

export default AudiolibrosInformacion;
