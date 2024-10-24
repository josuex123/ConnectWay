import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import NavBar from "../../components/PaginaInicio/Navbar";
import Audifono2 from '../../images/auriculares-redondeados.png';
import Audifono from '../../images/audifonos.png';
import Cabeza from '../../images/cabeza.png';
import Hora from '../../images/hora.png';
import '../../estilos/Audiolibros/AudiolibrosInformacion/AudiolibrosInformacion.css';
import AudiolibrosReproducir from '../../pages/audiolibros/AudiolibrosReproducir';

const AudiolibrosInformacion = () => {
    const isDisabled = true; 
    const location = useLocation();
    const { idLibro } = location.state || {};
    const [audiolibro, setAudiolibro] = useState(null);
    const [showAudiolibros, setShowAudiolibros] = useState(false); 

    useEffect(() => {
        const fetchAudiolibro = async () => {
            if (idLibro) {
                const docRef = doc(db, 'Audiolibro', idLibro); 
                const docSnap = await getDoc(docRef); 

                if (docSnap.exists()) {
                    setAudiolibro(docSnap.data()); 
                } else {
                    console.log("Documento no encontrado!");
                }
            }
        };

        fetchAudiolibro();
    }, [idLibro]);

    if (!audiolibro) {
        return <div>Cargando...</div>; 
    }

    const formatearCategoria = (categoria) => {
        if (!categoria) return ''; 
        return categoria
            .split('_') 
            .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1)) 
            .join(' '); 
    };

    const handleReproducirClick = () => {
        setShowAudiolibros(true); 
    };

    return (
        <>
            <NavBar/>
            <div className="pagina-inicio">
                <div className="audiolibro-container">
                    <div className="audiolibro-detalles">
                        <div className="contenido-audiolibro p">
                            <p><strong>Título:</strong> {audiolibro.titulo}</p>
                            <p><strong>Autor:</strong> {audiolibro.autor}</p>
                            <p>
                                <strong>Descripción:</strong>
                                <span className="text">
                                    {audiolibro.descripcion}
                                </span>
                            </p>
                            <div className="detalles-orden">  
                                <hr className="custom2-hr" />
                                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                                    <p style={{ marginRight: '20px' }}>
                                        <strong style={{color:'gray'}}>Calificación: ★★★★☆</strong> 
                                    </p>
                                    <p>
                                        <img src={Hora} alt="Icono de hora" className="categoria-icono" />
                                        {audiolibro.duracion} minutos
                                    </p>
                                </div>
                                <div style={{ marginTop: '10px' }}>
                                    <p>
                                        <img src={Audifono2} alt="Icono de audio" className="categoria-icono" /> Audio
                                    </p>
                                </div>   
                                <hr className="custom-hr" />
                                <div>
                                    <button className="btn-reproducir" 
                                        style={{ pointerEvents: isDisabled ? 'none' : 'auto', opacity: isDisabled ? 0.5 : 1, color: 'white', backgroundColor:'gray' }}
                                        disabled={true}>
                                        <img src={Audifono} alt="Audífono" style={{ width: '20px', marginRight: '10px' }} />
                                        Reproducir
                                    </button>
                                </div>
                                <div className="audiolibro-categoria">
                                    <img src={Cabeza} alt="Audífono" className="categoria-icono" />
                                    <p><strong>Categoría: </strong>{formatearCategoria(audiolibro.categoria)} </p>
                                </div>
                            </div>
                        </div>
                        <div className="audiolibro-portada">
                            <img src={audiolibro.imagenPortadaURL} alt="Portada del Audiolibro" />
                        </div>
                    </div>
                </div>
            </div>
            {/* ojoooooooo ESTO QUE APAREZCA CUANDO SE DA CLIC EN REPRODUCIR*/}
            <AudiolibrosReproducir/> 
        </>
    );
};

export default AudiolibrosInformacion;
