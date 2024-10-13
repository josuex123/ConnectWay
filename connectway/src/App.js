
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
import AudiobookSearch from "./pages/audiolibros/AudiolbroBuscar";

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Audiolibros" element={<Audiolibros />} />
        <Route path="/Comunidad" element={<Comunidad />} />
        <Route path="/MiActividad" element={<MiActividad />} />
        <Route path="/Perfil" element={<Perfil />} />
        <Route path="/Login" element={<LogIn />} />
        <Route path="/Audiolibros/añadir" element={<AudiolibrosAñadir />} />
        <Route path="/Audiolibros/registrados" element={<AudiolibrosRegistrado />} />
        <Route path="/Audiolibros/registrados/informacion" element={<AudiolibrosInformacion />} />
        <Route path="/Audiolibros/registrados/reproducir" element={<AudiolibrosReproducir />} />
        <Route path="/Audiolibros/editar" element={<AudiolibrosEditar />} />
        <Route path="/ListaAudioLibros" element={<AudiobookList/>} />
        <Route path="/Formulario" element={<FormularioAñadir/>} /> 
        <Route path="/FormularioEditar" element={<AudiobookEdit/>} /> 
        
        <Route path="/search" element={<AudiobookSearch/>} />

      </Routes>
    </Router>
  );
}

export default App;
