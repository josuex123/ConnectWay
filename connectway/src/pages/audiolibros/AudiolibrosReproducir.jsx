import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import '../../estilos/Audiolibros/AudiolibrosReproducir/AudiolibrosReproducir.css';
import NoContentPage from '../noContent/noContentPage';
import AumentarMin from '../../images/aumentDiezMin.png';
import RetricederMin from '../../images/retroCincoMin.png';
import Play from '../../images/play2.png';
import Pausa from '../../images/pausa.png';

const AudiolibrosReproducir = ({ portadaUrl,titulo,autor, audioUrl}) => {//Añadi este  parametro para recibir la url de la imagen
    const { role } = useParams(); // Obtenemos el valor del rol desde la URL
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
  
    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };
  
    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };
  
    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };
  
    const handleVolumeChange = (e) => {
        const volumeValue = e.target.value;
        setVolume(volumeValue);
        audioRef.current.volume = volumeValue;
    };

    // Si el rol es 1, no mostrar nada
    if (role === "1") {
        return null;
    }

    return (
        <div className="audio-player">
            {/* PONER LA IMAGEN AQUI DE LA BASE DE DATOS, USAMOS EL VALOR DEL PARAMETRO PARA PODER MOSTRAR LA IMAGEN */}
            <img src={ portadaUrl } alt="imagenAudiolibro" className="audio-image" />
  
            <div className="audio-details">
                <p className="audio-author"> {autor}</p>
                <p className="audio-title">{titulo}</p>
                <audio
                    ref={audioRef}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    src ={ audioUrl }
                />
                <div className="audio-controls">
                    <button onClick={() => (audioRef.current.currentTime -= 10)}>
                        <img src={RetricederMin} alt="Retrocede rapido" style={{ width: '25px', height: '25px' }} />
                    </button>

                    <button onClick={togglePlayPause}>
                        {isPlaying ? <img src={Pausa} alt="pausa" style={{ width: '30px', height: '30px' }} /> : <img src={Play} alt="play" style={{ width: '30px', height: '30px' }} />}
                    </button>

                    <button onClick={() => (audioRef.current.currentTime += 10)}>
                        <img src={AumentarMin} alt="Avance rapido" style={{ width: '25px', height: '25px' }} />
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
                <input
                    type="range"
                    value={volume}
                    min="0"
                    max="1"
                    step="0.1"
                    onChange={handleVolumeChange}
                />
            </div>
        </div>
    );
};

export default AudiolibrosReproducir;
