import React, { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { db, storage } from "../../firebaseConfig"; // Asegúrate de importar 'storage' para subir imágenes
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaPaperclip, FaPaperPlane } from "react-icons/fa"; // Íconos para clip y envío
import "../../estilos/comunidad/Comentarios.css";
import ModalCargando from "../../components/Modal/ModalCargando";
import { width } from "@fortawesome/free-solid-svg-icons/fa0";

const Comentarios = ({
  comunidadId,
  subComunidadId,
  postId,
  usuarioActual,
  mostrarComentarios,
}) => {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [imagenComentario, setImagenComentario] = useState(null); // Estado para la imagen
  const [imagenPreview, setImagenPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (imagenComentario) {
      setImagenPreview(URL.createObjectURL(imagenComentario)); // Crear la URL de previsualización
    } else {
      setImagenPreview(null); // Limpiar la previsualización si no hay imagen
    }
  }, [imagenComentario]);

  // Función para formatear la fecha y hora
  const formatearFecha = (fecha) => {
    const opciones = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(fecha).toLocaleString("es-ES", opciones);
  };

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
        fechaHora: doc.data().fechaHora?.toDate
          ? doc.data().fechaHora.toDate()
          : doc.data().fechaHora,
      }));
      setComentarios(comentariosCargados);
    });

    return () => unsubscribe();
  }, [comunidadId, subComunidadId, postId]);

  // Función para subir la imagen al Storage
  const subirImagen = async (archivo) => {
    setIsLoading(true); // Mostrar el modal
    try {
      const imagenRef = ref(
        storage,
        `comentarios/${Date.now()}_${archivo.name}`
      );
      const snapshot = await uploadBytes(imagenRef, archivo);
      return await getDownloadURL(snapshot.ref); // URL de descarga
    } finally {
      setIsLoading(false); // Ocultar el modal
    }
  };

  // Función para agregar un comentario
  const agregarComentario = async () => {
    if (!nuevoComentario.trim() && !imagenComentario) return;

    setIsLoading(true); // Mostrar el modal
    try {
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

      let urlImagen = null;
      if (imagenComentario) {
        urlImagen = await subirImagen(imagenComentario); // Subir imagen con el modal
      }

      await addDoc(comentariosRef, {
        contenido: nuevoComentario,
        usuario: usuarioActual || "Anónimo",
        fechaHora: new Date().toISOString(),
        imagen: urlImagen,
      });

      setNuevoComentario(""); // Limpiar estado
      setImagenComentario(null);
      setImagenPreview(null);
    } finally {
      setIsLoading(false); // Ocultar el modal
    }
  };

  if (!mostrarComentarios) return null;

  return (
    <div className="comentarios-container">
      <div className="comentarios-seccion">
        {comentarios.length > 0 ? (
          comentarios.map((comentario) => (
            <div key={comentario.id} className="comentario">
              {comentario.imagen && (
                <img
                  src={comentario.imagen}
                  alt="Comentario"
                  className="comentario-imagen"
                />
              )}
              <div className="comentario-texto">
                <strong>{comentario.usuario}:</strong>
                <span>{comentario.contenido}</span>
                <p>
                  {formatearFecha(
                    comentario.fechaHora || "Fecha no disponible"
                  )}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No hay comentarios aún.</p>
        )}
        <div className="nuevo-comentario">
          {imagenPreview && (
            <div className="imagen-preview">
              <img
                src={imagenPreview}
                alt="Previsualización"
                style={{
                  width: "100px",
                  borderRadius: "5px",
                  marginBottom: "10px",
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setImagenComentario(null);
                  setImagenPreview(null);
                }}
                className="eliminar-imagen"
              >
                Eliminar
              </button>
            </div>
          )}
          <div className="tooltip-container">
            <input
              type="text"
              placeholder="Escribe un comentario..."
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
              maxLength={500}
            />
            {nuevoComentario.length === 500 && (
              <div className="tooltip-box">
                Los comentarios no pueden exceder los 500 caracteres.
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            id="imagen-comentario"
            style={{ display: "none" }}
            onChange={(e) => setImagenComentario(e.target.files[0])}
          />
          <label htmlFor="imagen-comentario" className="btn-clip">
            <FaPaperclip size="1em" />
          </label>
          <button onClick={agregarComentario} className="boton-comentario">
            <FaPaperPlane size="1.3em" />
          </button>
        </div>
      </div>
      <ModalCargando isOpen={isLoading} message="Procesando tu comentario..." />
    </div>
  );
};

export default Comentarios;
