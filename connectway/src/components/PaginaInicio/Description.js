import React from 'react';
import '../../estilos/PaginaInicio/Description.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import okkoImage from '../../images/okko.jpg';
import keyoImage from '../../images/keyo.png';

const Description = () => {
    const images = [
        okkoImage,
        keyoImage
    ];

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
                {images.map((url, index) => (
                    <div key={index} className="description-box">
                        <img src={url} alt={`Portada del libro ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Description;