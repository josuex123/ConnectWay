import React from 'react';
import Navbar from '../../components/PaginaInicio/Navbar';
import '../../estilos/Audiolibros/Audiolibros.css'
//import MainImage from './MainImage';

const Audiolibros = () => {
    return (
        <div className="pagina-inicio">
            <Navbar />
            <div className="content">
                <div>
                    <h1> Pagina de audiolibros</h1>
                </div>
            </div>
        </div>
    );
};

export default Audiolibros;
