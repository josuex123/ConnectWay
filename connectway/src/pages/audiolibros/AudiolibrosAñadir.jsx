import React from 'react';
import Navbar from '../../components/PaginaInicio/Navbar';
import '../../estilos/Audiolibros/AudiolibrosAñadir.css'
import Formulario from '../../components/FormularioAñadir/Formulario';

//import MainImage from './MainImage';
const AudiolibrosAñadir = () => {
    return (
        <div className="pagina-inicio">
            <Navbar />
            
            <div className="content">
                <div className="formulario-añadir">
                    <Formulario/>
                </div>
                
            </div>
        </div>
    );
};

export default AudiolibrosAñadir;
