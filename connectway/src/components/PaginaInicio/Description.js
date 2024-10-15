import React, { useState, useEffect } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import '../../estilos/PaginaInicio/Description.css';

const Description = () => {
    const [audiolibros, setAudiolibros] = useState([]);

    useEffect(() => {
        const fetchAudiolibros = async () => {
            const audiolibrosCollection = collection(db, 'Audiolibro');
            const audiolibrosSnapshot = await getDocs(audiolibrosCollection);
            const audiolibrosList = audiolibrosSnapshot.docs.map(doc => doc.data());
            setAudiolibros(audiolibrosList);
        };

        fetchAudiolibros();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3, // Mostrar tres imágenes a la vez
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
                {audiolibros.map((audiolibro, index) => (
                    <div key={index} className="description-box">
                        <img src={audiolibro.imagenPortadaURL} alt={`Audiolibro ${index + 1}`} />
                        <div className="audiolibro-info">
                            <h3>{audiolibro.titulo}</h3>
                            <p>{audiolibro.autor}</p>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Description;

