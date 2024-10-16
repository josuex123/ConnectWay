import React from 'react';
import '../../estilos/Audiolibros/AudiolibrosInformacion/AudiolibrosInformacion.css'
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import NavBar from "../../components/PaginaInicio/Navbar";
import Logo from '../../images/logoejemplo.png';
import Audifono from '../../images/audifonos.png';
import Cabeza from '../../images/cabeza.png';
import Hora from '../../images/hora.png';

const AudiolibrosInformacion = () => {
    const location = useLocation();
    const { idLibro } = location.state || {};

    useEffect(() => {
        if (idLibro) {
        }
    }, [idLibro]);

    
    return (
        <div className="pagina-inicio">
            <NavBar/>
            <div className="audiolibro-container">
            
                <div className="audiolibro-detalles">
                    <div className="contenido-audiolibro p">
                        <p><strong>Título:</strong> Título del Audiolibro</p>

                        <p><strong>Autor:</strong> Autor del Audiolibro</p>
                        <p><strong>Descripción:</strong> Aquí va una breve descripción del audiolibro.</p>
                    </div> 
                    <div className="audiolibro-portada">
                        <img src={Logo} alt="Portada del Audiolibro" />
                    </div>
                </div>

                <div className="detalles-orden" >  
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p style={{ marginRight: '20px' }}>
                                <strong>Calificación:</strong> ★★★★☆
                            </p>
                            <p>
                                <img src={Hora} alt="Icono de hora" className="categoria-icono" />
                                <strong>Minutos:</strong> 120 minutos
                            </p>
                    </div>
                    <div>
                            <p><strong>Audio:</strong> Disponible</p>
                    </div>
                    
                </div>

                <hr style={{ border: '2px solid black', width: '600px', marginBottom: '10px', marginLeft: '120px' }} />
                
                <div>
                    <button className="btn-reproducir">
                            <img src={Audifono} alt="Audífono" style={{ width: '20px', marginRight: '10px' }} />
                                Reproducir
                    </button>
                </div>
        
                <div className="audiolibro-categoria">
                    <img src={Cabeza} alt="Audífono" className="categoria-icono" />
                    <p><strong>Categoría:</strong> Categoría del Audiolibro</p>
                </div>
            </div>
        </div>
    );
};

export default AudiolibrosInformacion;
