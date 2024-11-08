import React from 'react';
import Navbar from './Navbar';
import Header from './Header';
import Description from './Description';
import '../../estilos/PaginaInicio/inicio.css'
import '../../estilos/PaginaInicio/PaginaInicio.css'

const PaginaInicio = () => {
    return (
        <div className="pagina-inicio">
            
            <Navbar />
            <Header /> 
            
            <div className="content">
                <Description/>
                
            </div>
        </div>
    );
};

export default PaginaInicio;
