import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import NavBar from "../../components/PaginaInicio/Navbar";import Audifono2 from '../../images/auriculares-redondeados.png';
import Cabeza from '../../images/cabeza.png';
import Hora from '../../images/hora.png';
import '../../estilos/Audiolibros/AudiolibrosInformacion/AudiolibrosInformacion.css';
import AudiolibrosReproducir from '../../pages/audiolibros/AudiolibrosReproducir';
import { useAudioContext } from '../Context/AudioContext';
import { VerificarEstadoReporduccion } from '../../Services/EstadoReproduccion/VerificarEstadoReproduccion';
import { guardarEstadoReproduccion } from '../../Services/EstadoReproduccion/GuardarEstadoReproduccion';
import Reproducir from '../../images/boton-de-play.png';                        // Para el boton 
import Detener from '../../images/boton-detener.png';                           // Para el boton

const AudiolibrosInformacion = () => {
    const isDisabled = false; 
    const location = useLocation();
    const { idLibro } = location.state || {};
    const [audiolibro, setAudiolibro] = useState(null);
    const [showAudiolibros, setShowAudiolibros] = useState(false); 
    const { setAudiolibroData, iniciarReproductor, detenerReproductor } = useAudioContext();
    const [estadoBoton, setEstadoBoton]= useState('')
    const [estadoReproduccion, setEstadoReproduccion] = useState(null);


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

        const verificar = async() =>{
            const existeDocumento =  await VerificarEstadoReporduccion(idLibro,0);
            console.log(existeDocumento)
            if(existeDocumento !== null){
                setEstadoBoton('Reanudar');
                setEstadoReproduccion(existeDocumento);
                console.log("Existe un estado de "+ existeDocumento)
            }else{
                setEstadoBoton('Reproducir');
                setEstadoReproduccion(null);
            }
        };

        fetchAudiolibro();
        verificar();
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

    const handleReproducirClick = async () => {
        console.log("estado desde boton repro "+estadoReproduccion)
        const audiolibroData = {
            portadaUrl: audiolibro.imagenPortadaURL,
            titulo: audiolibro.titulo,
            autor: audiolibro.autor,
            audioUrl: audiolibro.archivoAudioURL,
            idAudiolibro:idLibro,
            estadoActualReproduccion:estadoReproduccion
        };
    
        
        console.log(audiolibroData);
        setEstadoBoton('Detener');
    
        if (estadoBoton === 'Reproducir' && estadoReproduccion === null) {//en este caso no hay registro de escucha
                try {
                    const nuevoDoc = await guardarEstadoReproduccion(0, idLibro);
                    console.log("Documento guardado:", nuevoDoc);
                    iniciarReproductor(audiolibroData);
                    setEstadoBoton('Detener');
                } catch (error) {
                    console.error("Error al guardar el documento de 1ra escucha:", error);
                }

        } else if (estadoBoton === 'Detener') {
            try {
                await detenerReproductor();
                //Actualizar el estado de la variable de este componente para pasar al repro
                const existeDocumento =  await VerificarEstadoReporduccion(idLibro,0);
                setEstadoReproduccion(existeDocumento);
                setEstadoBoton('Reanudar')
            } catch (error) {
                
            }
            }else if(estadoBoton === 'Reanudar'){
               try {
                 //Actualizar el estado de reproduccion para pasarle al reproductor por si acaso una vez mas antes de reanudar
                 const existeDocumento =  await VerificarEstadoReporduccion(idLibro,0);
                 setEstadoReproduccion(existeDocumento);
                 console.log("Nuevo estado de reproduccion antes reanudar "+existeDocumento);
                 console.log("Nuevo estado de reproduccion antes reanudar info "+estadoReproduccion);
                 const audiolibroDataActualizado = {
                    ...audiolibroData,
                    estadoActualReproduccion: existeDocumento
                };
                 iniciarReproductor(audiolibroDataActualizado);
                 setEstadoBoton('Detener');
               } catch (error) {
                
               }
            }   
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
                                        style={{ pointerEvents: 'auto', opacity: 1, color: 'white' }}
                                        type='button'
                                        onClick={handleReproducirClick}>
                                        <img
                                            className="icono"
                                            src={estadoBoton === 'Reproducir' ? Reproducir : Detener}
                                            alt={estadoBoton === 'Reproducir' ? "Reproducir" : "Detener"}
                                            style={{ width: '25px', marginRight: '15px' }}
                                        />
                                         <span className="texto">{estadoBoton}</span>
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
        </>
    );
};

export default AudiolibrosInformacion;