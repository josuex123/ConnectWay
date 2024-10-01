import logo from './logo.svg';
import React, { useEffect } from "react";
import './App.css';
import  app  from "./firebaseConfig"; 

function App() {
  useEffect(() => {
    // Comprobando si Firebase se ha inicializado correctamente
    if (app) {
      console.log("Firebase se ha inicializado correctamente");
    } else {
      console.error("Error al inicializar Firebase");
    }
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
