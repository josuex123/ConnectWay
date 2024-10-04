import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';
import  app  from "./firebaseConfig"; 

function App() {
  useEffect(() => {
    if (app) {
      console.log("Firebase se ha inicializado correctamente");
    } else {
      console.error("Error al inicializar Firebase");
    }
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
