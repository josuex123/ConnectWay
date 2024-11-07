import React, { useState, useEffect } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Contenedor from '../../components/Contenedor/Contenedor'; 
import '../../estilos/PaginaInicio/Description.css';

const Description = () => {
    const [audiolibros, setAudiolibros] = useState([]);
    const navigate = useNavigate();
    const rol = 0;

    useEffect(() => {
        const fetchAudiolibros = async () => {
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

        fetchAudiolibros();
    }, []);

    const handleContainerClick = (id) => {
        navigate(`/Audiolibros/registrados/informacion/${rol}`, { state: { idLibro: id } });
    };
    const formatearCategoriaParaMostrar = (categoria) => {
        if (!categoria) return "Sin Categoría"; // Manejar valores indefinidos
        return categoria
            .replace(/_/g, ' ') 
            .toLowerCase() 
            .replace(/(^|\s)\S/g, (letra) => letra.toUpperCase()); 
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            }
        ]
    };

    return (
        <div className="description">
            <Slider {...settings}>
                {audiolibros.map((audiolibro) => (
                    <div key={audiolibro.id} className="contenedor">
                        <Contenedor
                            imgPortada={audiolibro.imagenPortadaURL}
                            titulo={audiolibro.titulo}
                            autor={audiolibro.autor}
                            descripcion={audiolibro.descripcion}
                            categoria={formatearCategoriaParaMostrar(audiolibro.categoria)}
                            duracion={audiolibro.duracion}
                            rol={rol}
                            onClick={() => handleContainerClick(audiolibro.id)}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Description;
