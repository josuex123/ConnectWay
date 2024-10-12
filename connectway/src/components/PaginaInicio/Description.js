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
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <div className="description">
            <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index} className="description-box">
                        <img src={image} alt={`Audiolibro ${index}`} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Description;