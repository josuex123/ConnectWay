import "./noContent.css";
import React from 'react';
import NavBar from "../../components/PaginaInicio/Navbar";

const noContentPage = () => {
 
  return (
    <div className="page">
      <NavBar/>
        <div className="noContent-title">
            <img src="https://www.shutterstock.com/image-vector/road-construction-workers-paving-asphalt-600nw-2021981651.jpg" alt="en construccion" />
        <h2>Lo sentimos está sección del sitio está en construcción</h2>
        <p>Por favor vuelve a la página anterior</p>
        
        </div>
        
        
    </div>
  );
};

export default noContentPage;
