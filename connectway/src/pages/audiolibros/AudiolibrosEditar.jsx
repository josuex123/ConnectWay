import React from 'react';
import Navbar from '../../components/PaginaInicio/Navbar';
import '../../estilos/Audiolibros/AudiolibrosAñadir.css'
import Formulario from './FormularioEditar';
//import MainImage from './MainImage';

const AudiolibrosAñadir = () => {
    return (
        <div className="pagina-inicio">
            <Navbar />
            
            <div className="content">
                <Formulario/>
               
                
            </div>
        </div>
    );
};

export default AudiolibrosAñadir;
