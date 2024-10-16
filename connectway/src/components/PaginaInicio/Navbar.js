import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation, useParams } from 'react-router-dom';
import '../../estilos/PaginaInicio/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import logo from '../../images/logoejemplo.png';
import person from '../../images/usuario.png';
import home from '../../images/hogar.png';
import cabeza from '../../images/cabeza.png';
import audifonos from '../../images/auriculares-redondeados.png';
import amigues from '../../images/amigues.png';

const Navbar = () => {
  const [isAudiolibrosOpen, setAudiolibrosOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useParams(); // Obtiene el rol de la URL (0 o 1)
  const isAdmin = role === '1'; // Determina si es admin o usuario
  const isDisabled = true; // No modificamos el estado de isDisabled, tal como solicitaste

  const handleAudiolibrosClick = (e) => {
    e.preventDefault();
    if (isAudiolibrosOpen) {
      navigate(`/audiolibros/${role}`);
    } else {
      setAudiolibrosOpen(true);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink exact to={`/home/${role}`} className="nav-logo">
          <img src={logo} alt="Logo" className="nav-logo-image" />
          CONNECTWAY
        </NavLink>

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <NavLink exact to={`/home/${role}`} className="nav-linkss" onClick={() => setMenuOpen(false)}>
              Inicio
              <img src={home} alt="IconHome" className="nav-logo-image1" />
            </NavLink>
          </li>

          <li className="nav-item dropdown">
            <span
              className={`nav-links dropbtn ${location.pathname.includes('/audiolibros') ? 'active' : ''}`}
              onClick={handleAudiolibrosClick}
            >
              Audiolibros
              <img src={audifonos} alt="IconAudi" className="nav-logo-image1" />
            </span>
            {isAudiolibrosOpen && (
              <div className="dropdown-content">
                {isAdmin && (
                  <>
                    <NavLink
                      to={`/audiolibros/añadir/${role}`}
                      className={`dropdown-link ${location.pathname === `/audiolibros/añadir/${role}` ? 'active' : ''}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      Registrar audiolibro
                    </NavLink>
                    <NavLink
                      to={`/audiolibros/registrados/${role}`}
                      className={`dropdown-link ${location.pathname === `/audiolibros/registrados/${role}` ? 'active' : ''}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      Audiolibros registrados
                    </NavLink>
                  </>
                )}
              </div>
            )}
          </li>

          <li className="nav-item">
            <NavLink
              to={`/comunidad/${role}`}
              className={`nav-links ${isDisabled ? 'disabled' : ''}`} // Mantiene isDisabled
              style={{ pointerEvents: isDisabled ? 'none' : 'auto', opacity: isDisabled ? 0.5 : 1 }}
              onClick={() => setMenuOpen(false)}
            >
              Comunidad
              <img src={amigues} alt="IconComu" className="nav-logo-image1" />
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to={`/MiActividad/${role}`}
              className={`nav-links ${isDisabled ? 'disabled' : ''}`} // Mantiene isDisabled
              style={{ pointerEvents: isDisabled ? 'none' : 'auto', opacity: isDisabled ? 0.5 : 1 }}
              onClick={() => setMenuOpen(false)}
            >
              Mi actividad
              <img src={cabeza} alt="IconCabeza" className="nav-logo-image1" />
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to={`/Perfil/${role}`}
              className={`nav-links ${isDisabled ? 'disabled' : ''}`} // Mantiene isDisabled
              style={{ pointerEvents: isDisabled ? 'none' : 'auto', opacity: isDisabled ? 0.5 : 1 }}
              onClick={() => setMenuOpen(false)}
            >
              Perfil
              <img src={person} alt="IconPerson" className="nav-logo-image1" />
            </NavLink>
          </li>
        </ul>

        <div className="nav-icon" onClick={toggleMenu}>
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="menu-icon" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
