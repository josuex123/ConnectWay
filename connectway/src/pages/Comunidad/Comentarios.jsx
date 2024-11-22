import React, { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "../../estilos/comunidad/Comentarios.css";

const Comentarios = ({ comunidadId, subComunidadId, postId, usuarioActual, mostrarComentarios }) => {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");

  // Función para obtener comentarios en tiempo real
  useEffect(() => {
    if (!comunidadId || !subComunidadId || !postId) return;

    const comentariosRef = collection(
      db,
      "Comunidades",
      comunidadId,
      "comunidades",
      subComunidadId,
      "posts",
      postId,
      "comentarios"
    );

    const unsubscribe = onSnapshot(comentariosRef, (snapshot) => {
      const comentariosCargados = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComentarios(comentariosCargados);
    });

    return () => unsubscribe();
  }, [comunidadId, subComunidadId, postId]);

  // Función para agregar un comentario
  const agregarComentario = async () => {
    if (!nuevoComentario.trim()) return;

    const comentariosRef = collection(
      db,
      "Comunidades",
      comunidadId,
      "comunidades",
      subComunidadId,
      "posts",
      postId,
      "comentarios"
    );

    await addDoc(comentariosRef, {
      contenido: nuevoComentario,
      usuario: usuarioActual || "Anónimo",
      fechaHora: new Date().toISOString(),
    });

    setNuevoComentario(""); // Limpiar el campo de texto
  };

  if (!mostrarComentarios) return null;

  return (
    <div className="comentarios-container">
      <div className="comentarios-seccion">
        {comentarios.length > 0 ? (
          comentarios.map((comentario) => (
            <div key={comentario.id} className="comentario">
              <strong>{comentario.usuario}:</strong>
              <p>{comentario.contenido}</p>
              <span>{new Date(comentario.fechaHora).toLocaleString()}</span>
            </div>
          ))
        ) : (
          <p>No hay comentarios aún.</p>
        )}
        <div className="nuevo-comentario">
          <input
            type="text"
            placeholder="Escribe un comentario..."
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
          />
          <button onClick={agregarComentario}>Enviar</button>
        </div>
      </div>
    </div>
  );
};

export default Comentarios;
