import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import NavBar from "../../components/PaginaInicio/Navbar";
import Audifono2 from '../../images/auriculares-redondeados.png';
import Cabeza from '../../images/cabeza.png';
import Hora from '../../images/hora.png';
import '../../estilos/Audiolibros/AudiolibrosInformacion/AudiolibrosInformacion.css';
import AudiolibrosReproducir from '../../pages/audiolibros/AudiolibrosReproducir';
import { useAudioContext } from '../Context/AudioContext';
import { VerificarEstadoReporduccion } from '../../Services/EstadoReproduccion/VerificarEstadoReproduccion';
import { guardarEstadoReproduccion } from '../../Services/EstadoReproduccion/GuardarEstadoReproduccion';
import Reproducir from '../../images/boton-de-play.png';                        // Para el boton 
import Detener from '../../images/boton-detener.png';                           // Para el boton
import ModalNotificacion from '../../components/Modal/ModalNotificacion';

const AudiolibrosInformacion = () => {
    const isDisabled = false; 
    const location = useLocation();
    const { idLibro } = location.state || {};
    const [audiolibro, setAudiolibro] = useState(null);
    const [showAudiolibros, setShowAudiolibros] = useState(false); 
    const { setAudiolibroData, iniciarReproductor, detenerReproductor, audiolibroData } = useAudioContext();
    const [estadoBoton, setEstadoBoton]= useState('')
    const [estadoReproduccion, setEstadoReproduccion] = useState(null);
    const [mensajeVisible, setMensajeVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };


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
            const datos = obtenerReproductor();
            if(idLibro===datos.idLibro && datos.estadoReproductor === true){
                setEstadoBoton('Detener');

            }else{
            const existeDocumento =  await VerificarEstadoReporduccion(idLibro,0);
            console.log(existeDocumento)
            if(existeDocumento !== null && existeDocumento > 0){//hay un estado y es mayor  0
                setEstadoBoton('Reanudar');
                setEstadoReproduccion(existeDocumento);
            }else if(existeDocumento === 0){
                setEstadoBoton('Reproducir');
                setEstadoReproduccion(0);
            }else{// hay un estado igual a 0
                setEstadoBoton('Reproducir');
                setEstadoReproduccion(null);
            }
        }
        };

        fetchAudiolibro();
        verificar();
    }, [idLibro]);

    useEffect(() => {
        if (!audiolibroData) {
          // Actualiza el estado del botón cuando el reproductor se cierra
          if (estadoReproduccion > 0) {
            setEstadoBoton("Reanudar");
          } else {
            setEstadoBoton("Reproducir");
          }
        }
      }, [audiolibroData, estadoReproduccion]);

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

    // Guardar datos en localStorage
function guardarReproductor(idLibro, estadoReproductor) {
    localStorage.setItem('reproductor', JSON.stringify({ idLibro, estadoReproductor }));
}

// Recuperar datos del reproductor
function obtenerReproductor() {
    const reproductor = JSON.parse(localStorage.getItem('reproductor'));
    return reproductor ? reproductor : null;
}




    const handleReproducirClick = async () => {
        if(audiolibro.archivoAudioURL === ""){
            setIsModalOpen(true);
            //alert("Audio no disponible intente mas tarde")
        }else{
        console.log("estado desde boton repro "+estadoReproduccion)
        const audiolibroData = {
            portadaUrl: audiolibro.imagenPortadaURL,
            titulo: audiolibro.titulo,
            autor: audiolibro.autor,
            audioUrl: audiolibro.archivoAudioURL,
            idAudiolibro:idLibro,
            estadoActualReproduccion:estadoReproduccion
        };  
        //console.log(audiolibroData);
        //setEstadoBoton('Detener');
            if (estadoBoton === 'Reproducir' && estadoReproduccion === null) {//en este caso no hay registro de escucha
                try {
                    const nuevoDoc = await guardarEstadoReproduccion(0, idLibro);
                    iniciarReproductor(audiolibroData);
                    setEstadoBoton('Detener');
                    guardarReproductor(idLibro, true);

                } catch (error) {
                    console.error("Error al guardar el documento de 1ra escucha:", error);
                }

        } else if(estadoBoton === 'Reproducir' && estadoReproduccion === 0){
                iniciarReproductor(audiolibroData);
                setEstadoBoton('Detener');
                guardarReproductor(idLibro, true);
        }else if (estadoBoton === 'Detener') {
            try {
                await detenerReproductor();

                setMensajeVisible(true);
                setTimeout(() => {
                setMensajeVisible(false);
                }, 3000);

                //Actualizar el estado de la variable de este componente para pasar al repro
                await new Promise(resolve => setTimeout(resolve, 500));                  
                const existeDocumento =  await VerificarEstadoReporduccion(idLibro,0);
                setEstadoReproduccion(existeDocumento);
                    if(existeDocumento===0){
                        setEstadoBoton('Reproducir');
                    }else{
                        setEstadoBoton('Reanudar')
                    } 
                    guardarReproductor(idLibro, false);              
            } catch (error) {
                
            }
            }else if(estadoBoton === 'Reanudar'){
               try {
                 //Actualizar el estado de reproduccion para pasarle al reproductor por si acaso una vez mas antes de reanudar
                 const existeDocumento =  await VerificarEstadoReporduccion(idLibro,0);
                 setEstadoReproduccion(existeDocumento);                
                 const audiolibroDataActualizado = {
                    ...audiolibroData,
                    estadoActualReproduccion: existeDocumento
                };
                 iniciarReproductor(audiolibroDataActualizado);
                 setEstadoBoton('Detener');
                 guardarReproductor(idLibro, true);
               } catch (error) {
                
               }
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
                        <h1 className="titulo-audiolibro">{audiolibro.titulo}</h1>
                        <h2 className="autor-audiolibro">{audiolibro.autor}</h2>
                            <p className="text">                                
                                {audiolibro.descripcion}                               
                            </p>
                            <div className="detalles-orden">  
                                <hr className="custom2-hr" />
                                <div className="detalles-info" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                                    <p style={{ marginRight: '20px' }}>
                                        <strong style={{color:'gray'}}>Calificación: ★★★★☆</strong> 
                                    </p>
                                    <p>
                                        <img src={Hora} alt="Icono de hora" className="icono-detalle"/>
                                        {audiolibro.duracion} minutos
                                    </p>
                                </div>
                                <div style={{ marginTop: '10px' }}>
                                    <p>
                                        <img src={Audifono2} alt="Icono de audio" className="icono-detalle" /> Audio
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
                                            style={{ width: '25px', marginRight: '4px' }}
                                        />
                                         <span className="texto">{estadoBoton}</span>
                                    </button>
                                </div>
                                <div className="audiolibro-categoria">
                                    <img src={Cabeza} alt="Audífono" className="categoria-icono" />
                                    <p>{formatearCategoria(audiolibro.categoria)} </p>
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

            {mensajeVisible && (
            <div className="mensaje-confirmacion">
                El progreso de escucha se registró exitosamente
            </div>
            )}

            <ModalNotificacion
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                type="error"
                message="El audio no está disponible, intente más tarde."
                iconClass="fa-exclamation-circle"
            />

        </>
    );
};

export default AudiolibrosInformacion;