import React from 'react';
import Navbar from '../../components/PaginaInicio/Navbar';
import '../../estilos/Audiolibros/AudiolibrosAñadir.css'
import Formulario from './Formulario';
//import MainImage from './MainImage';

const AudiolibrosAñadir = () => {
    return (
        <div className="pagina-inicio">
            <Navbar />
            
            <div className="content">
                 <h3 className="titulo-añadir"> Pagina de añadir audiolibros</h3>
                <div className="formulario-añadir">
                    <Formulario/>
                </div>
                
            </div>
        </div>
    );
};

export default AudiolibrosAñadir;
