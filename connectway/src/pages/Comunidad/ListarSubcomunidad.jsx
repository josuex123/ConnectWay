import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/PaginaInicio/Navbar';
import '../../estilos/comunidad/unirseComunidad.css';
import ContenedorComunidad from '../../components/ContenedorComunidad/ContenedorComunidad';


const listarSubComunidad = () => {
  const [titulo, setTitulo] = useState('');   

  return (
    
    <div className="pagina-inicio">
    <Navbar />
    <div className="content-audiolibro">
        <h1 className='titulo-aud-reg'>Comunidades de {titulo}</h1>
        <div className="d-flex justify-content-between align-items-center">
           
            <div className="d-flex justify-content-around flex-wrap" style={{ width: '80%'}}>
                
            </div>
           
        </div>
        
    </div>
    
</div>

  );
};

export default listarSubComunidad;
