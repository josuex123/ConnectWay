import React, { createContext, useContext, useRef, useState } from "react";

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const reproductorRef = useRef();
  const [audiolibroData, setAudiolibroData] = useState(null);

  const iniciarReproductor = (data) => {
    setAudiolibroData(data);
    console.log("iniciando rep",data);
    reproductorRef.current.iniciarReproductor(data);
  };
  const detenerReproductor = (data) => {
    reproductorRef.current.detenerReproductor(data);
    setAudiolibroData(null);
  };

  return (
    <AudioContext.Provider value={{ reproductorRef, iniciarReproductor, detenerReproductor, audiolibroData, setAudiolibroData }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => {
  const contexto = useContext(AudioContext);
  if (!contexto) {
    throw new Error('algo pasaaaaaaaa');
  }
  return contexto;
};