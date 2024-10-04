import React from 'react';
import Navbar from '../../components/PaginaInicio/Navbar';
import '../../estilos/comunidad/comunidad.css'
import noContentPage from '../noContent/noContentPage'
//import MainImage from './MainImage';

const Audiolibros = () => {
    return (
        <div className="pagina-inicio">
            <Navbar />
            <div className="content">
            <noContentPage/>
            </div>
        </div>
    );
};

export default Audiolibros;
