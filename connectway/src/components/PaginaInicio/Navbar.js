import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../../estilos/PaginaInicio/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [click, setClick] = useState(false);
  const [isAudiolibrosOpen, setAudiolibrosOpen] = useState(false); // Nuevo estado
  const navigate = useNavigate();

  const handleClick = () => setClick(!click);

  const handleAudiolibrosClick = (e) => {
    e.preventDefault(); // Evitar la navegación inmediata
    if (isAudiolibrosOpen) {
      // Si el menú ya estaba abierto, redirigir a la página principal de Audiolibros
      navigate('/audiolibros');
    } else {
      // Si el menú no estaba abierto, desplegarlo
      setAudiolibrosOpen(true);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink exact to="/" className="nav-logo">
          CONNECTWAY
        </NavLink>

        <ul className={click ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <NavLink exact to="/" className="nav-links" onClick={handleClick}>
              Inicio
            </NavLink>
          </li>
          <li className="nav-item dropdown">
            <span
              className="nav-links dropbtn"
              onClick={handleAudiolibrosClick} // Actualizado
            >
              Audiolibros
            </span>
            {isAudiolibrosOpen && (
              <div className="dropdown-content">
                <NavLink to="/audiolibros/añadir" className="dropdown-link" onClick={() => setAudiolibrosOpen(false)}>
                  Añadir audiolibro
                </NavLink>
                <NavLink to="/audiolibros/registrados" className="dropdown-link" onClick={() => setAudiolibrosOpen(false)}>
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
