
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AudiobookList from "./Services/AudiolibrosServicios/AudiobooksList";
import FormularioAñadir from './components/FormularioAñadir/Formulario';
import Audiolibros from './pages/audiolibros/Audiolibros';
import AudiolibrosRegistrado from './pages/audiolibros/AudiolibrosRegistrado';
import AudiolibrosAñadir from './pages/audiolibros/AudiolibrosAñadir';
import Comunidad from './pages/comunidad/Comunidad';
import MiActividad from './pages/miActividad/MiActividad';
import Perfil from './pages/perfil/Perfil';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Audiolibros" element={<Audiolibros />} />
        <Route path="/Comunidad" element={<Comunidad />} />
        <Route path="/MiActividad" element={<MiActividad />} />
        <Route path="/Perfil" element={<Perfil />} />
        <Route path="/Audiolibros/añadir" element={<AudiolibrosAñadir />} />
        <Route path="/Audiolibros/registrados" element={<AudiolibrosRegistrado />} />
        <Route path="/ListaAudioLibros" element={<AudiobookList/>} />
        <Route path="/Formulario" element={<FormularioAñadir/>} /> 
      </Routes>
    </Router>
  );
}

export default App;
