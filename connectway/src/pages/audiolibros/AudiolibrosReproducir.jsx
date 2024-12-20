import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAudioContext } from '../Context/AudioContext';
import '../../estilos/Audiolibros/AudiolibrosReproducir/AudiolibrosReproducir.css';
import AumentarMin from '../../images/aumentDiezMin1.png';
import RetricederMin from '../../images/retroCincoMin1.png';
import Play from '../../images/play3.png';
import Pausa from '../../images/pausa1.png';
import Silencio from '../../images/volumenSilOfi.png';
import Volumen from '../../images/volumenVolOfi.png';
import { editarEstadoReproduccion } from '../../Services/EstadoReproduccion/EditarEstadoReproduccion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const AudiolibrosReproducir = forwardRef((props, ref) => {
    const { role } = useParams();
    const navigate = useNavigate();
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const { audiolibroData, setAudiolibroData } = useAudioContext();

    const [isVolumeOpen, setIsVolumeOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [previousVolume, setPreviousVolume] = useState(volume);

    const [activo, setActivo] = useState(false);
    const [portadaUrl, setPortadaUrl] = useState(null);
    const [titulo, setTitulo] = useState(null);
    const [autor, setAutor] = useState(null); 
    const [audioUrl, setAudioUrl] = useState(null); 
    const [idAudiolib, setIdAudiolibro] = useState(null); 
    const [estadoReproduccion, setEstadoReproduccion] = useState(0);

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            if (audioRef.current.currentTime === audioRef.current.duration) {
                audioRef.current.currentTime = 0;
            }
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleVolumeDisplay = () => {
        setIsVolumeOpen(!isVolumeOpen);
    };

    const toggleMute = () => {
        if (isMuted) {
            setVolume(previousVolume);
            audioRef.current.volume = previousVolume;
        } else {
            setPreviousVolume(volume);
            setVolume(0);
            audioRef.current.volume = 0;
        }
        setIsMuted(!isMuted);
    };

    const handleVolumeIconClick = () => {
        if (window.innerWidth <= 700) {
            toggleVolumeDisplay();
        } else {
            toggleMute();
        }
    };

    useImperativeHandle(ref, () => ({
        iniciarReproductor({ portadaUrl, titulo, autor, audioUrl, idAudiolibro, estadoActualReproduccion }) {
            try{
                setPortadaUrl(portadaUrl);
                setTitulo(titulo);
                setAutor(autor);
                setAudioUrl(audioUrl);
                setActivo(true);
                setIdAudiolibro(idAudiolibro);
                setEstadoReproduccion(estadoActualReproduccion);
                setIsPlaying(true);
            }catch(error){
                console.log(error);
            }
        },
    
        detenerReproductor: async () => {
            try {
                const estadoEscuchado = audioRef.current.currentTime;
        
                // Detener audio y actualizar el estado localmente primero para una respuesta rápida
                audioRef.current.pause();
                setIsPlaying(false);
                setPortadaUrl(null);
                setTitulo(null);
                setAutor(null);
                setAudioUrl(null);
                setActivo(false);
                setAudiolibroData(null);
                // Actualizar el estado de reproducción en segundo plano
                editarEstadoReproduccion(0, idAudiolib, estadoEscuchado, audioUrl).catch(error => {
                    console.error("AQUI al actualizar el estado de reproducción", error);
                });
            } catch (error) {
                console.error("Error al detener el reproductor", error);
            }
        },
        
    }));

    useEffect(() => {
        if (audioRef.current && estadoReproduccion > 0) {
            audioRef.current.currentTime = estadoReproduccion;
        }
    }, [estadoReproduccion]);

    useEffect(() => {
        if (audioRef.current && isPlaying) {
            try {
                audioRef.current.play();
            } catch (error) {
                console.log("Error al reproducir el audiolibro", error);
            }
        }
    }, [audioUrl, isPlaying]);

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
        if (estadoReproduccion > 0) {
            audioRef.current.currentTime = estadoReproduccion;
        }
    };

    const handleVolumeChange = (e) => {
        const volumeValue = parseFloat(e.target.value);
        setVolume(volumeValue);
        audioRef.current.volume = volumeValue;
        setIsMuted(volumeValue === 0);

        if (volumeValue > 0 && isMuted) {
            setIsMuted(false);
        }
    };

    const handleAudioEnded = () => {
        setIsPlaying(false);
        audioRef.current.currentTime = 0;
    };

        // Función para redirigir a la página de información del audiolibro
    const handleRedirectToInfo = () => {
        navigate(`/Audiolibros/registrados/informacion/${role}`, { state: { idLibro: idAudiolib } });
    };

    if(role === "1"){
        return null;
    }

    if(!activo){
        return null;
    }

    return (
        <div className="audio-player">
            <button className="close-button" onClick={ref.current?.detenerReproductor}>
                <FontAwesomeIcon icon={faXmark} alt="Cerrar" className='close-icon'/>
            </button>
            <img src={portadaUrl} alt="imagenAudiolibro" className="audio-image" onClick={handleRedirectToInfo}/>
            <div className="audio-details">
                <p className="audio-author">{autor}</p>
                <p className="audio-title" onClick={handleRedirectToInfo}>{titulo}</p>
                <audio
                    ref={audioRef}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleAudioEnded}
                    src={audioUrl}
                />
                <div className="audio-controls">
                    <button onClick={() => (audioRef.current.currentTime -= 5)}>
                        <img src={RetricederMin} alt="Retrocede rápido" style={{ width: '35px', height: '35px' }} />
                    </button>

                    <button onClick={togglePlayPause}>
                        {isPlaying ? <img src={Pausa} alt="pausa" style={{ width: '40px', height: '40px' }} /> : <img src={Play} alt="play" style={{ width: '40px', height: '40px' }} />}
                    </button>

                    <button onClick={() => (audioRef.current.currentTime += 10)}>
                        <img src={AumentarMin} alt="Avance rápido" style={{ width: '35px', height: '35px' }} />
                    </button>
                </div>

                <div className="audio-timeline">
                    <span>{new Date(currentTime * 1000).toISOString().substring(14, 19)}</span>
                    <input
                        type="range"
                        value={currentTime}
                        max={duration}
                        onChange={(e) => (audioRef.current.currentTime = e.target.value)}
                    />
                    <span>{new Date(duration * 1000).toISOString().substring(14, 19)}</span>
                </div>
            </div>

            <div className="audio-volume-container">
                <img
                    src={isMuted || volume === 0 ? Silencio : Volumen}
                    alt={isMuted || volume === 0 ? "Volumen silencio" : "Volumen activo"}
                    className="volume-icon"
                    onClick={handleVolumeIconClick}
                />
                <div className={`audio-volume ${isVolumeOpen ? 'open' : ''}`}>
                    <input
                        type="range"
                        value={volume}
                        min="0"
                        max="1"
                        step="0.01"
                        onChange={handleVolumeChange}
                    />
                </div>
            </div>
        </div>
    );
});
export default AudiolibrosReproducir;