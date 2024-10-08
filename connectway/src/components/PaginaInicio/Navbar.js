import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import '../../estilos/PaginaInicio/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import logo from '../../images/logoejemplo.png';
import person from '../../images/usuario.png';
import home from '../../images/hogar.png';

const Navbar = () => {
  const [click, setClick] = useState(false);
  const [isAudiolibrosOpen, setAudiolibrosOpen] = useState(false);
  const location = useLocation(); // Para obtener la ruta actual
  const navigate = useNavigate();

  const handleClick = () => setClick(!click);

  const handleAudiolibrosClick = (e) => {
    e.preventDefault(); 
    if (isAudiolibrosOpen) {
      navigate('/audiolibros');
    } else {
      setAudiolibrosOpen(true);
    }
  };

  // Función para verificar si el botón de Audiolibros o los submenús están activos
  const isAudiolibrosActive = () => {
    return location.pathname.includes('/audiolibros');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink exact to="/" className="nav-logo">
          <img src={logo} alt="Logo" className="nav-logo-image" />
          CONNECTWAY
        </NavLink>

        <ul className={click ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <NavLink exact to="/" className="nav-linkss" onClick={handleClick}>
              Inicio
              <img src={home} alt="IconHome" className="nav-logo-image1" />
            </NavLink>
          </li>

          <li className="nav-item dropdown">
            <span
              className={`nav-links dropbtn ${isAudiolibrosActive() ? 'active' : ''}`} 
              onClick={handleAudiolibrosClick}
            >
              Audiolibros
            </span>
            {isAudiolibrosOpen && (
              <div className="dropdown-content">
                <NavLink 
                  to="/audiolibros/añadir" 
                  className={`dropdown-link ${location.pathname === '/audiolibros/añadir' ? 'active' : ''}`}
                  onClick={() => setAudiolibrosOpen(false)}
                >
                  Añadir audiolibro
                </NavLink>
                <NavLink 
                  to="/audiolibros/registrados" 
                  className={`dropdown-link ${location.pathname === '/audiolibros/registrados' ? 'active' : ''}`} 
                  onClick={() => setAudiolibrosOpen(false)}
                >
                  Audiolibros registrados
                </NavLink>
              </div>
            )}
          </li>

          <li className="nav-item">
            <NavLink to="/comunidad" className="nav-links" onClick={handleClick}>
              Comunidad
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/MiActividad" className="nav-links" onClick={handleClick}>
              Mi actividad
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/Perfil" className="nav-links" onClick={handleClick}>
              Perfil
              <img src={person} alt="IconPerson" className="nav-logo-image1" />
            </NavLink>
          </li>
        </ul>

        <div className="nav-icon" onClick={handleClick}>
          <FontAwesomeIcon icon={click ? faTimes : faBars} className="menu-icon" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
