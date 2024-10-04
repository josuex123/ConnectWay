import React from 'react';
import Navbar from '../../components/PaginaInicio/Navbar';
import '../../estilos/PaginaInicio/Audiolibros/AudiolibrosRegistrado.css'
//import MainImage from './MainImage';

const AudiolibroRegistrado = () => {
    return (
        <div className="pagina-inicio">
            <Navbar />
            <div className="content">
            <div>
                    <h1> Pagina de registrar audiolibros</h1>
                </div>
            </div>
        </div>
    );
};

export default AudiolibroRegistrado;
