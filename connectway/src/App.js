
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';
import AudiobookList from "./Services/AudiolibrosServicios/AudiobooksList";
import FormAudiolibro from './pages/audiolibros/FormAudiolibro';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ListaAudioLibros" element={<AudiobookList/>} />
        <Route path="/FormAudioLibro" element={<FormAudiolibro/>} />
      </Routes>
    </Router>
  );
}

export default App;
