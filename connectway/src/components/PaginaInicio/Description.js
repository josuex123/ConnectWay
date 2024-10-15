import React, { useState, useEffect } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import '../../estilos/PaginaInicio/Description.css';

const Description = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            const audiolibrosCollection = collection(db, 'Audiolibro');
            const audiolibrosSnapshot = await getDocs(audiolibrosCollection);
            const imagesList = audiolibrosSnapshot.docs.map(doc => doc.data().imagenPortadaURL);
            setImages(imagesList);
        };

        fetchImages();
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
                {images.map((image, index) => (
                    <div key={index} className="description-box">
                        <img src={image} alt={`Audiolibro ${index + 1}`} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Description;
