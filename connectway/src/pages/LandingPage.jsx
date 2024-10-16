import React from 'react';
import './LandingPage.css';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import logo from '../images/logoejemplo.png';
import portada from '../images/desktop.png';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <nav className="nav-landing">
        <div className='nav-container-landing'>
          <NavLink exact to="/" className="nav-logo-landing">
            <img src={logo} alt="Logo" className="nav-logo-image" />
            CONNECTWAY
          </NavLink>
          <ul className="nav-menu-landing">
            <li className='nav-items-landing'>
              <NavLink className="nav-link-landing">
                 Categorías 
                <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: '5px' }} />
              </NavLink>
            </li>
            <li className='nav-items-landing'>
              <NavLink className="nav-link-landing">
                Iniciar sesión
                <FontAwesomeIcon icon={faSignInAlt} style={{ marginLeft: '5px' }} />
              </NavLink>
            </li>
            {/*<li className='nav-items-landing'>
              <NavLink className="nav-link-start-landing" to="/Home"> Comenzar </NavLink>
            </li>*/}
          </ul>
        </div>
      </nav>

      <section className="main-content">
        <div className="text-content">
          <h1 className='titulo-landing'>“El alma que se cura a sí misma puede curar a otros” - Pitágoras</h1>
          
          <p className='texto-landing'>
          Descubre audiolibros sobre <span className="highlight">inteligencia emocional</span>, 
          <span className="highlight">meditación</span>, <span className="highlight">salud mental</span> 
          y <span className="highlight">psicología de parejas</span> con ConnectWay. Únete, aprende y 
          conecta en comunidad.
          </p>
          <NavLink className="btn-start-landing" to="/Home">Comenzar</NavLink>
        </div>
        <div className="image-content">
          <img src={portada} alt="Portada" className="phone-image" />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;