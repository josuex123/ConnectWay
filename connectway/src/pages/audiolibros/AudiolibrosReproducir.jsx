import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAudioContext } from '../Context/AudioContext';
import '../../estilos/Audiolibros/AudiolibrosReproducir/AudiolibrosReproducir.css';
import AumentarMin from '../../images/aumentDiezMin.png';
import RetricederMin from '../../images/retroCincoMin.png';
import Play from '../../images/play2.png';
import Pausa from '../../images/pausa.png';
import Silencio from '../../images/volumenSil.png';
import Volumen from '../../images/volumenVol.png';
import { editarEstadoReproduccion } from '../../Services/EstadoReproduccion/EditarEstadoReproduccion';

const AudiolibrosReproducir = forwardRef((props, ref) => {
    const { role } = useParams();
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const { audiolibroData } = useAudioContext();

    const [activo, setActivo] = useState(false);
    const [portadaUrl, setPortadaUrl] = useState(null);
    const [titulo, setTitulo] = useState(null);
    const [autor, setAutor] = useState(null); 
    const [audioUrl, setAudioUrl] = useState(null); 
    const [idAudiolibro, setIdAudiolibro] = useState(null); 
    const [estadoReproduccion, setEstadoReproduccion] = useState(0);

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    useImperativeHandle(ref, () => ({
        iniciarReproductor({ portadaUrl, titulo, autor, audioUrl, idAudiolibro, estadoActualReproduccion }) {
            setPortadaUrl(portadaUrl);
            setTitulo(titulo);
            setAutor(autor);
            setAudioUrl(audioUrl);
            setActivo(true);
            setIdAudiolibro(idAudiolibro);
            setEstadoReproduccion(estadoActualReproduccion);
        },
    
        detenerReproductor: async () => {
            try {
                const estadoEscuchado = audioRef.current.currentTime;
                await editarEstadoReproduccion(0, idAudiolibro, estadoEscuchado, audioUrl);
                setIsPlaying(false); 
            } catch (error) {
                console.error("Error al detener el reproductor", error);
            }
            setPortadaUrl(null);
            setTitulo(null);
            setAutor(null);
            setAudioUrl(null);
            setActivo(false);
        },
    }));

    useEffect(() => {
        if (audioRef.current && estadoReproduccion > 0) {
            audioRef.current.currentTime = estadoReproduccion;
        }
    }, [estadoReproduccion]);

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
        const volumeValue = e.target.value;
        setVolume(volumeValue);
        audioRef.current.volume = volumeValue;
    };

    if (role === "1") {
        return null;
    }

    if (!activo) {
        return null;
    }

    return (
        <div className="audio-player">
            <img src={portadaUrl} alt="imagenAudiolibro" className="audio-image" />
            <div className="audio-details">
                <p className="audio-author">{autor}</p>
                <p className="audio-title">{titulo}</p>
                <audio
                    ref={audioRef}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    src={audioUrl}
                />
                <div className="audio-controls">
                    <button onClick={() => (audioRef.current.currentTime -= 5)}>
                        <img src={RetricederMin} alt="Retrocede rápido" style={{ width: '25px', height: '25px' }} />
                    </button>

                    <button onClick={togglePlayPause}>
                        {isPlaying ? <img src={Pausa} alt="pausa" style={{ width: '30px', height: '30px' }} /> : <img src={Play} alt="play" style={{ width: '30px', height: '30px' }} />}
                    </button>

                    <button onClick={() => (audioRef.current.currentTime += 10)}>
                        <img src={AumentarMin} alt="Avance rápido" style={{ width: '25px', height: '25px' }} />
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

            <div className="audio-volume">
                <img
                    src={volume <= 0.00 ? Silencio : Volumen}
                    alt={volume <= 0.00 ? "Volumen silencio" : "Volumen activo"}
                    className="volume-icon"
                />
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
    );
});

export default AudiolibrosReproducir;
