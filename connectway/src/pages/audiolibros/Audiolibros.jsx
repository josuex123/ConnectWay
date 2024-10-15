import React, { useState, useEffect } from 'react';
import Navbar from '../../components/PaginaInicio/Navbar';
import '../../estilos/Audiolibros/AudiolibrosRegistrado.css';
import Contenedor from '../../components/Contenedor/Contenedor';
import { db } from '../../firebaseConfig';
import { collection, getDocs} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const AudiolibroUsuario = () => {
    const [audiolibros, setAudiolibros] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const maxItems = 3;

    const rol = 0;
    const navigate = useNavigate();

    useEffect(() => {
        reloadAudiolibros();
    }, []);

    const reloadAudiolibros = async () => {
        const audiolibrosCollection = collection(db, 'Audiolibro');
        const audiolibrosSnapshot = await getDocs(audiolibrosCollection);
        const audiolibrosList = audiolibrosSnapshot.docs.map(doc => ({
            id: doc.id,
            imagenPortadaURL: doc.data().imagenPortadaURL, 
            titulo: doc.data().titulo,
            autor: doc.data().autor,
            categoria: doc.data().categoria,
            descripcion: doc.data().descripcion,
            duracion: doc.data().duracion,
            archivoAudioURL: doc.data().archivoAudioURL
        }));
        setAudiolibros(audiolibrosList);
    };

    const next = () => {
        if (currentIndex < audiolibros.length - maxItems) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    
    const handleContainerClick = (id) => {
        navigate(`/Audiolibros/registrados/informacion`, { state: { idLibro: id } });
    };

    return (
        <div className="pagina-inicio">
            <Navbar />
            <div className="content">
                <div>
                    <h4>Audiolibros recientes</h4>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                    <button
                        className="btn"
                        onClick={prev}
                        disabled={currentIndex === 0}
                        style={{
                            fontSize: '3rem',
                            padding: '10px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: '#000',
                        }}
                    >
                        &lt;
                    </button>
                    <div className="d-flex justify-content-around flex-wrap" style={{ width: '80%' }}>
                        {audiolibros.slice(currentIndex, currentIndex + maxItems).map((libro, index) => (
                            <Contenedor
                                key={index}
                                imgPortada={libro.imagenPortadaURL}
                                titulo={libro.titulo}
                                autor={libro.autor}
                                descripcion={libro.descripcion}
                                duracion={libro.duracion}
                                rol={rol}
                                onEdit={null} 
                                onDelete={null} 
                                onClick={() => handleContainerClick(libro.id)}
                            />
                        ))}
                    </div>
                    <button
                        className="btn"
                        onClick={next}
                        disabled={currentIndex >= audiolibros.length - maxItems}
                        style={{
                            fontSize: '3rem',
                            paddingRight: '10px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: '#000',
                        }}
                    >
                        &gt;
                    </button>
                </div>
            </div>
            
           
        </div>
    );
};

export default AudiolibroUsuario;
