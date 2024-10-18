import React from 'react';
import Navbar from './Navbar';
import Header from './Header';
import Description from './Description';
import '../../estilos/PaginaInicio/inicio.css'
import NoContentPage from '../../pages/noContent/noContentPage';
//import MainImage from './MainImage';

const PaginaInicio = () => {
    return (
        <div className="pagina-inicio">
            <div  className="container">
            <Navbar />
            <Header />
            </div>
            
            <div className="content">
                <Description/>
                
            </div>
        </div>
    );
};

export default PaginaInicio;
