import React from 'react';
import './LandingPage.css';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import logo from '../images/logoejemplo.png';
import portada from '../images/hero_desktop.webp';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <nav className="nav-landing">
        <div className='nav-container-lan'>
          <NavLink exact to="/" className="nav-logo">
            <img src={logo} alt="Logo" className="nav-logo-image" />
            CONNECTWAY
          </NavLink>
          <ul className="nav-menu">
            <li className='nav-items'>
              <NavLink className="nav-lin">
                Categorías 
                <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: '5px' }} />
              </NavLink>
            </li>
            <li className='nav-items'>
              <NavLink className="nav-lin">
                Iniciar sesión
                <FontAwesomeIcon icon={faSignInAlt} style={{ marginLeft: '5px' }} />
              </NavLink>
            </li>
            <li className='nav-items'>
              <NavLink className="nav-lin-start" to="/Home"> Comenzar </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      <section className="main-content">
        <div className="text-content">
          <h1 className='titulo-landing'>“El alma que se cura a sí misma puede curar a otros” - Pitágoras</h1>
          
          <p className='texto-landing'>
            Explora audiolibros sobre 
            <span className="highlight">inteligencia emocional</span>, <span className="highlight">meditación</span>, 
            <span className="highlight">salud mental</span> y <span className="highlight">psicología de parejas</span> 
            en 15 minutos con la aplicación ConnectWay.<br/>
            Conéctate con gente y diviértete en comunidades.
          </p>
          <NavLink className="btn-start" to="/Home">Comenzar</NavLink>
        </div>
        <div className="image-content">
          <img src={portada} alt="Portada" className="phone-image" />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;