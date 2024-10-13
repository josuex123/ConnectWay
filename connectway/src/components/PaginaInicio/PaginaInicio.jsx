import React from 'react';
import Navbar from './Navbar';
import Header from './Header';
import Description from './Description';
import NoContentPage from '../../pages/noContent/noContentPage';
//import MainImage from './MainImage';

const PaginaInicio = () => {
    return (
        <div className="pagina-inicio">
            {/*<Navbar />*/}
            <Header />
            <div className="content">
                <NoContentPage/>
                
            </div>
        </div>
    );
};

export default PaginaInicio;
