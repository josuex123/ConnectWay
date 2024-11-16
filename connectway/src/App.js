import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Index from './pages/LandingPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { AudioProvider, useAudioContext } from './pages/Context/AudioContext';

import AudiobookList from "./Services/AudiolibrosServicios/AudiobooksList";
import FormularioAñadir from './components/FormularioAñadir/Formulario';
import Audiolibros from './pages/audiolibros/Audiolibros';
import AudiolibrosRegistrado from './pages/audiolibros/AudiolibrosRegistrado';
import AudiolibrosReproducir from './pages/audiolibros/AudiolibrosReproducir';
import AudiolibrosInformacion from './pages/audiolibros/AudiolibrosInformacion';
import AudiolibrosEditar from './pages/audiolibros/AudiolibrosEditar';
import AudiolibrosAñadir from './pages/audiolibros/AudiolibrosAñadir';
import CrearComunidad from './pages/Comunidad/CrearComunidad' 
import UnirseComunidad from './pages/Comunidad/UnirseComunidad';  
import MisComunidades from './pages/Comunidad/MisComunidades';  
import VerComunidad from './pages/Comunidad/VerComunidad';  
import MiActividad from './pages/miActividad/miActividad';
import Perfil from './pages/perfil/perfil';
import LogIn from './pages/users/login';
import AudiobookEdit from './pages/audiolibros/FormularioEditar';
import IniciarSesion from './pages/SesionUsuario/IniciarSesion';
import CrearCuenta from './pages/SesionUsuario/CrearCuenta';


function App() {
  const { reproductorRef, audiolibroData } = useAudioContext();
  return (
    <Router>
      <div className = {audiolibroData? 'reproductor' : ''}>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Ruta dinámica con parámetro de rol */}
          <Route path="/Home/:role" element={<Home />} />
          <Route path="/Audiolibros/:role" element={<Audiolibros />} />
          <Route path="/MiActividad/:role" element={<MiActividad />} />
          <Route path="/Perfil/:role" element={<Perfil />} />
          <Route path="/Login" element={<LogIn />} />
          <Route path="/IniciarSesion" element={<IniciarSesion />} />
          <Route path="/CrearCuenta" element={<CrearCuenta />} />
          
          {/* Rutas para el admin */}
          <Route path="/Audiolibros/añadir/:role" element={<AudiolibrosAñadir />} />
          <Route path="/Audiolibros/registrados/:role" element={<AudiolibrosRegistrado />} />
          <Route path="/Audiolibros/registrados/informacion/:role" element={<AudiolibrosInformacion />} />
          <Route path="/Audiolibros/registrados/reproducir/:role" element={<AudiolibrosReproducir />} />
          <Route path="/Audiolibros/editar/:role" element={<AudiolibrosEditar />} />
          
          {/* Rutas adicionales */}
          <Route path="/ListaAudioLibros/:role" element={<AudiobookList />} />
          <Route path="/Formulario/:role" element={<FormularioAñadir />} /> 
          <Route path="/FormularioEditar/:role" element={<AudiobookEdit />} /> 
          <Route path="/comunidad/crear/:role" element={<CrearComunidad />} />
          <Route path="/comunidad/unirse/:role" element={<UnirseComunidad />} />
          <Route path="/comunidad/mis-comunidades/:role" element={<MisComunidades />} />
          <Route path="/comunidad/ver-comunidad/:role" element={<VerComunidad />} />
        </Routes>
      </div>
      <AudiolibrosReproducir ref = {reproductorRef}/>
    </Router>
  );
}

export default App;