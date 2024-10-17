import React from 'react';
import '../../estilos/Audiolibros/AudiolibrosInformacion/AudiolibrosInformacion.css'
import { useLocation } from 'react-router-dom';
import { useEffect,useState } from 'react';
import { db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import NavBar from "../../components/PaginaInicio/Navbar";
import Audifono2 from '../../images/auriculares-redondeados.png';
import Audifono from '../../images/audifonos.png';
import Cabeza from '../../images/cabeza.png';
import Hora from '../../images/hora.png';

const AudiolibrosInformacion = () => {
    const isDisabled = true; 
    const location = useLocation();
    const { idLibro } = location.state || {};
    const [audiolibro, setAudiolibro] = useState(null);

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
    return (
        <div className="pagina-inicio">
            <NavBar/>
            <div className="audiolibro-container">
            
                <div className="audiolibro-detalles">
                    <div className="contenido-audiolibro p">
                        <p><strong>Título:</strong> {audiolibro.titulo}</p>

                        <p><strong>Autor:</strong> {audiolibro.autor}</p>
                        <p><strong>Descripción:</strong> {audiolibro.descripcion}</p>
                    </div> 
                    <div className="audiolibro-portada">
                        <img src={audiolibro.imagenPortadaURL}  alt="Portada del Audiolibro" />
                    </div>
                </div>

                <div className="detalles-orden" >  
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p style={{ marginRight: '20px' }}>
                                <strong>Calificación:</strong> ★★★★☆
                            </p>
                            <p>
                                <img src={Hora} alt="Icono de hora" className="categoria-icono" />
                                {audiolibro.duracion} minutos
                            </p>
                    </div>
                    <div>
                            <p>
                            <img src={Audifono2} alt="Icono de hora" className="categoria-icono" />
                            Audio </p>
                    </div>
                    
                </div>

                <hr style={{ border: '2px solid black', width: '600px', marginBottom: '10px', marginLeft: '120px' }} />
                
                <div>
                    <button className="btn-reproducir" 
                    style={{ pointerEvents: isDisabled ? 'none' : 'auto', opacity: isDisabled ? 0.5 : 1 }}
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
    );
};

export default AudiolibrosInformacion;
