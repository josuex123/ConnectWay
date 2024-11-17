import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/PaginaInicio/Navbar';
import '../../estilos/comunidad/unirseComunidad.css';
import Contenedor from '../../components/Contenedor/Contenedor';
import { db } from '../../firebaseConfig';
import { collection, getDocs, doc, deleteDoc, query, where } from 'firebase/firestore';
import ModalNotificacion from '../../components/Modal/ModalNotificacion';
import ModalConfirmacion from '../../components/Modal/ModalConfirmacion';
import { useNavigate } from 'react-router-dom';
import AudiobookSearch2 from '../../components/BarraBuscador/BarraBuscador'; 
import AudiolibrosReproducir from '../../pages/audiolibros/AudiolibrosReproducir';
import Categorias from '../../components/TarjetaCategoria/TarjetaCategoria';


const UnirseComunidad = () => {
  return (
    
    <div className="pagina-inicio">
    <Navbar />
    <div className="content-audiolibro">
        <h1 className='titulo-aud-reg'>Audiolibros Registrados</h1>
        <div className="d-flex justify-content-between align-items-center">
            <button className="btn"  
            style={{
                fontSize: '3rem',
                paddingRight: '10px',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#000',
            }}>&lt;</button>
            <div className="d-flex justify-content-around flex-wrap" style={{ width: '80%'}}>
                
            </div>
           
        </div>
        <div className="contenedor-categoria"> 
            <h4 className="titulo-categoria">Categorías</h4>
            <p className="texto-categoria">Explora nuestras categorías</p>
            <div className="tarjetas-cat d-flex justify-content-between flex-wrap">
           
            </div>
        </div>
    </div>
    
</div>

  );
};

export default UnirseComunidad;
