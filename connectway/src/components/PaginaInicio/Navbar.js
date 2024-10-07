import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../../estilos/PaginaInicio/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import logo from '../../images/logoejemplo.png';
import person from '../../images/usuario.png';
import home from '../../images/hogar.png';


const Navbar = () => {
  const [click, setClick] = useState(false);
  
  const handleClick = () => setClick(!click);

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
            <NavLink to="/audiolibros" className="nav-links dropbtn" onClick={handleClick}>
              Audiolibros
            </NavLink>
            <div className="dropdown-content">
              <NavLink to="/audiolibros/añadir" className="dropdown-link">
                Añadir audiolibro
              </NavLink>
              <NavLink to="/audiolibros/registrados" className="dropdown-link">
                Audiolibros registrados
              </NavLink>
            </div>
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
