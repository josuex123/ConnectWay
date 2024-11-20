import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation, useParams } from 'react-router-dom';
import '../../estilos/PaginaInicio/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import logo from '../../images/logoejemplo1.jpeg';
import person from '../../images/usuario1.png';
import home from '../../images/hogar1.png';
import cabeza from '../../images/cabeza.png';
import audifonos from '../../images/auriculares-redondeados1.png';
import amigues from '../../images/grupo.png';

const Navbar = () => {
  const [isAudiolibrosOpen, setAudiolibrosOpen] = useState(false);
  const [isComunidadOpen, setComunidadOpen] = useState(false); // Estado para controlar el dropdown de Comunidad
  const [isMenuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useParams();
  const isAdmin = role === '1'; 
  const isDisabled = true;

  // Manejo del botón de Audiolibros
  const handleAudiolibrosClick = (e) => {
    e.preventDefault();
    if (isAudiolibrosOpen) {
      navigate(`/audiolibros/${role}`);
    } else {
      setAudiolibrosOpen(true);
    }
  };

  // Manejo del botón de Comunidad
  const handleComunidadClick = (e) => {
    e.preventDefault();
    if (isComunidadOpen) {
      setComunidadOpen(false);  
    } else {
      setComunidadOpen(true);  
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
          <span className="nav-logo-text connect">Connect</span>
          <span className="nav-logo-text way">Way</span>
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
              className={`nav-linkss1 ${location.pathname.includes('/audiolibros') ? 'active' : ''}`}
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

          <li className="nav-item dropdown">
            <span
              className={`nav-linkss2 ${location.pathname.includes('/comunidad') ? 'active' : ''}`}
              onClick={handleComunidadClick}
            >
              Comunidad
              <img src={amigues} alt="IconComu" className="nav-logo-image1" />
            </span>
            {isComunidadOpen && (
              <div className="dropdown-content">
                <NavLink
                  to={`/comunidad/crear/${role}`}
                  className={`dropdown-link ${location.pathname === `/comunidad/crear/${role}` ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  Crear Comunidad
                </NavLink>
                <NavLink
                  to={`/comunidad/unirse/${role}`}
                  className={`dropdown-link ${location.pathname === `/comunidad/unirse/${role}` ? 'active' : ''}`}
                  //style={{ pointerEvents: isDisabled ? 'none' : 'auto', opacity: isDisabled ? 0.5 : 1 }}
                  onClick={() => setMenuOpen(false)}
                >
                  Unirse a Comunidad
                </NavLink>
                <NavLink
                  className="dropdown-link"
                  onClick={(e) => {
                    e.preventDefault();
                    const correoUsuario = sessionStorage.getItem('correoUsuario');
                    if (correoUsuario) {
                      navigate('/comunidad/ver-comunidad', { state: { correo: correoUsuario } });
                    } else {
                      alert('No se ha encontrado el correo del usuario. Por favor, inicie sesión.');
                    }
                  }}
                >
                  Mis Comunidades
                </NavLink>

              </div>
            )}
          </li>

          <li className="nav-item">
            <NavLink
              to={`/MiActividad/${role}`}
              className={`nav-linkss3 disabled`}
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
              className={`nav-linkss4 disabled`}
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
