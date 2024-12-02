import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation, useParams } from 'react-router-dom';
import '../../estilos/PaginaInicio/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { getAuth, signOut } from 'firebase/auth';
import logo from '../../images/logoejemplo1.jpeg';
import person from '../../images/usuario1.png';
import home from '../../images/hogar1.png';
import cabeza from '../../images/cabeza.png';
import audifonos from '../../images/auriculares-redondeados1.png';
import amigues from '../../images/grupo.png';

const Navbar = () => {
  const [isAudiolibrosOpen, setAudiolibrosOpen] = useState(false);
  const [isComunidadOpen, setComunidadOpen] = useState(false); 
  const [isPerfilOpen, setPerfilOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useParams();
  const isAdmin = role === '1'; 
  const isDisabled = true;
  const [isAudioEnabled, setAudioEnabled] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [isListening, setIsListening] = useState(false);

  const normalizeText = (text) => {
    return text.toLowerCase().trim();
  };
  
  // Función para manejar el reconocimiento de voz
  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Tu navegador no soporta reconocimiento de voz.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.interimResults = false; // Solo resultados finales
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      console.log('Reconocimiento de voz iniciado');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setRecognizedText(transcript);
      console.log('Texto reconocido:', transcript);

  // Acción basada en el texto reconocido
  const transcriptNormalized = normalizeText(transcript);

  if (transcriptNormalized.includes('inicio')) {
    navigate(`/home/${role}`);
  } else if (transcriptNormalized.includes('audiolibros')) {
    navigate(`/audiolibros/${role}`);
  } else if (transcriptNormalized.includes('perfil')) {
    navigate(`/perfil/${role}`);
  } else if (transcriptNormalized.includes('crear comunidad') || transcriptNormalized.includes('nueva comunidad')) {
    navigate(`/comunidad/crear/${role}`);
  } else if (transcriptNormalized.includes('unirse a comunidad')) {
    navigate(`/comunidad/unirse/${role}`);
  } else if (transcriptNormalized.includes('cerrar sesión')) {
    cerrarSesion();
  } else if (transcriptNormalized.includes('mis comunidades')) {
    const correoUsuario = sessionStorage.getItem('correoUsuario');
    if (correoUsuario) {
      navigate('/comunidad/ver-comunidad', { state: { correo: correoUsuario } });
    } else {
      alert('No se ha encontrado el correo del usuario. Por favor, inicie sesión.');
    }
  } else {
    alert(`No se encontró una acción para: "${transcript}"`);
  }
  
    };

    recognition.onerror = (event) => {
      console.error('Error de reconocimiento de voz:', event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('Reconocimiento de voz terminado');
    };

    recognition.start();
  };


  const handleAudiolibrosClick = (e) => {
    e.preventDefault();
    if (isAudiolibrosOpen) {
      navigate(`/audiolibros/${role}`);
    } else {
      setAudiolibrosOpen(true);
    }
  };

  const handleComunidadClick = (e) => {
    e.preventDefault();
    if (isComunidadOpen) {
      setComunidadOpen(false);  
    } else {
      setComunidadOpen(true);  
    }
  };

  const handlePerfilClick = (e) => {
    e.preventDefault();
    if (isPerfilOpen) {
      setPerfilOpen(false);  
    } else {
      setPerfilOpen(true);  
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const speakText = (text) => {
    if (isAudioEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES'; // Idioma español
      utterance.rate = 1; // Velocidad normal
      utterance.pitch = 1; // Tono normal
      utterance.volume = 1; // Volumen máximo
      speechSynthesis.speak(utterance);
    }
  };

  const toggleAudio = () => {
    setAudioEnabled((prevState) => !prevState);
  };

  const cerrarSesion = async () => {
    const auth = getAuth(); 
    try {
      await signOut(auth);
      sessionStorage.removeItem('correoUsuario'); // Limpia el correo del usuario almacenado
      setMenuOpen(false); 
      console.log('Sesión cerrada con éxito');
      navigate('/'); // Redirige al inicio
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Hubo un problema al cerrar sesión. Por favor, inténtalo de nuevo.');
    }
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
            <NavLink exact to={`/home/${role}`} className="nav-linkss" onClick={() => setMenuOpen(false)} onMouseEnter={() => speakText('Inicio')}>
              Inicio
              <img src={home} alt="IconHome" className="nav-logo-image1" />
            </NavLink>
          </li>

          <li className="nav-item dropdown">
            <span
              className={`nav-linkss1 ${location.pathname.includes('/audiolibros') ? 'active' : ''}`}
              onClick={handleAudiolibrosClick}
              onMouseEnter={() => speakText('Audiolibros')}
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
                      onMouseEnter={() => speakText('Registrar audiolibro')}
                    >
                      Registrar audiolibro
                    </NavLink>
                    <NavLink
                      to={`/audiolibros/registrados/${role}`}
                      className={`dropdown-link ${location.pathname === `/audiolibros/registrados/${role}` ? 'active' : ''}`}
                      onClick={() => setMenuOpen(false)}
                      onMouseEnter={() => speakText('Audiolibros registrados')}
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
              onMouseEnter={() => speakText('Comunidad')}
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
                  onMouseEnter={() => speakText('Crear Comunidad')}
                >
                  Crear Comunidad
                </NavLink>
                <NavLink
                  to={`/comunidad/unirse/${role}`}
                  className={`dropdown-link ${location.pathname === `/comunidad/unirse/${role}` ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                  onMouseEnter={() => speakText('Unirse a Comunidad')}
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
                  onMouseEnter={() => speakText('Mis Comunidades')}
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
              onMouseEnter={() => speakText('Mi actividad')}
            >
              Mi actividad
              <img src={cabeza} alt="IconCabeza" className="nav-logo-image1" />
            </NavLink>
          </li>

          <li className="nav-item dropdown">
            <span
              className={`nav-linkss4 ${location.pathname.includes('/Perfil') ? 'active' : ''}`}
              onClick={handlePerfilClick}
              onMouseEnter={() => speakText('Perfil')}
            >
              Perfil
              <img src={person} alt="IconPerson" className="nav-logo-image1" />
            </span>
            {isPerfilOpen && (
              <div className="dropdown-content">
                <NavLink
                  to={`/perfil/${role}`}
                  className={`dropdown-link ${location.pathname === `/perfil/${role}` ? 'active' : ''}`}
                  style={{ pointerEvents: isDisabled ? 'none' : 'auto', opacity: isDisabled ? 0.5 : 1 }}
                  onClick={() => setMenuOpen(false)}
                  onMouseEnter={() => speakText('Ver Perfil')}
                >
                  Ver Perfil
                </NavLink>
                <NavLink
                  to={`/perfil/${role}`}
                  className={`dropdown-link ${location.pathname === `/perfil/${role}` ? 'active' : ''}`}
                  style={{ pointerEvents: isDisabled ? 'none' : 'auto', opacity: isDisabled ? 0.5 : 1 }}
                  onClick={() => setMenuOpen(false)}
                  onMouseEnter={() => speakText('Configuración')}
                >
                  Configuración
                </NavLink>
                <NavLink
                  to={`/`}
                  className={`dropdown-link ${location.pathname === `/` ? 'active' : ''}`}
                  onClick={cerrarSesion}
                  onMouseEnter={() => speakText('Cerrar Sesión')}
                >
                  Cerrar Sesión
                </NavLink>
              </div>
            )}
          </li>
        </ul>

        <div className="nav-icon" onClick={toggleMenu}>
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="menu-icon" />
        </div>
        <button onClick={toggleAudio} className="submit-bot">
          {isAudioEnabled ? 'Desactivar audio' : 'Activar audio'}
        </button>
        <div>
            {/* Botón para reconocimiento de voz */}
        <button onClick={startVoiceRecognition} className={`voice-button ${isListening ? 'active' : ''}`}>
          <FontAwesomeIcon icon={faMicrophone} /> {isListening ? 'Escuchando...' : 'Hablar'}
        </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;