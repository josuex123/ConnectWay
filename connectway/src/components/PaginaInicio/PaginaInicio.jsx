import React from 'react';
import Navbar from './Navbar';
import Header from './Header';
import Description from './Description';
//import MainImage from './MainImage';

const PaginaInicio = () => {
    return (
        <div className="pagina-inicio">
            <Navbar />
            <Header />
            <div className="content">
                <Description />
                
            </div>
        </div>
    );
};

export default PaginaInicio;
