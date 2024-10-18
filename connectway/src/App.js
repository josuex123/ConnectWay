
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Index from './pages/LandingPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AudiobookList from "./Services/AudiolibrosServicios/AudiobooksList";
import FormularioAñadir from './components/FormularioAñadir/Formulario';
import Audiolibros from './pages/audiolibros/Audiolibros';
import AudiolibrosRegistrado from './pages/audiolibros/AudiolibrosRegistrado';
import AudiolibrosReproducir from './pages/audiolibros/AudiolibrosReproducir';
import AudiolibrosInformacion from './pages/audiolibros/AudiolibrosInformacion';
import AudiolibrosEditar from './pages/audiolibros/AudiolibrosEditar';
import AudiolibrosAñadir from './pages/audiolibros/AudiolibrosAñadir';
import Comunidad from './pages/comunidad/comunidad';
import MiActividad from './pages/miActividad/miActividad';
import Perfil from './pages/perfil/perfil';
import LogIn from './pages/users/login';
import AudiobookEdit from './pages/audiolibros/FormularioEditar';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        
        {/* Ruta dinámica con parámetro de rol */}
        <Route path="/Home/:role" element={<Home />} />
        <Route path="/Audiolibros/:role" element={<Audiolibros />} />
        <Route path="/Comunidad/:role" element={<Comunidad />} />
        <Route path="/MiActividad/:role" element={<MiActividad />} />
        <Route path="/Perfil/:role" element={<Perfil />} />
        <Route path="/Login" element={<LogIn />} />
        
        {/* Rutas para el admin */}
        <Route path="/Audiolibros/añadir/:role" element={<AudiolibrosAñadir />} />
        <Route path="/Audiolibros/registrados/:role" element={<AudiolibrosRegistrado />} />
        <Route path="/Audiolibros/registrados/informacion/:role" element={<AudiolibrosInformacion />} />
        <Route path="/Audiolibros/registrados/reproducir/:role" element={<AudiolibrosReproducir />} />
        <Route path="/Audiolibros/editar/:role" element={<AudiolibrosEditar />} />
        
        {/* Rutas adicionales */}
        <Route path="/ListaAudioLibros/:role" element={<AudiobookList/>} />
        <Route path="/Formulario/:role" element={<FormularioAñadir/>} /> 
        <Route path="/FormularioEditar/:role" element={<AudiobookEdit/>} /> 
      </Routes>
    </Router>
  );
}

export default App;
