
import React, { useState, useEffect, useRef } from "react";
import {doc,getDoc,updateDoc,setDoc,collection,getDocs,} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "../../estilos/comunidad/Post.css";
import defaultUser from "../../images/usuario.png";
import LikeGreyIcon from "../../images/like-grey.png";
import LikeIcon from "../../images/like.png"; /*like*/
import SadIcon from "../../images/sad.PNG"; /*sad*/
import CareIcon from "../../images/care.png"; /*care*/
import WowIcon from "../../images/wow.png"; /*wow*/
import AngryIcon from "../../images/angry.png"; /*angry*/
import HahaIcon from "../../images/haha.png"; /*haha*/
import LoveIcon from "../../images/love.png"; /*love*/
import LaughIcon from "../../images/laugh.png"; /*laugh*/
import Comentarios from "./Comentarios"; /*comentarios*/
import { onSnapshot } from "firebase/firestore"; 

const reactions = [
  { id: "like", label: "Me gusta", icon: LikeIcon },
  { id: "love", label: "Me encanta", icon: LoveIcon },
  { id: "care", label: "Me importa", icon: CareIcon },
  { id: "haha", label: "Me divierte", icon: HahaIcon },
  { id: "wow", label: "Me asombra", icon: WowIcon },
  { id: "sad", label: "Me entristece", icon: SadIcon },
  { id: "angry", label: "Me enoja", icon: AngryIcon },
  { id: "laugh", label: "Me hace reír mucho", icon: LaughIcon }, 
];



const Post = ({titulo,contenido,imagenUsuario,nombreUsuario,imagenPost,comunidadId,subComunidadId,postId,fechaHora,}) => {
  const [mostrarTodo, setMostrarTodo] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [lastReaction, setLastReaction] = useState(null);
  const [postReactions, setPostReactions] = useState([]);
  const reactionRef = useRef(null);
  const limiteCaracteres = 200;
  const userId = sessionStorage.getItem('correoUsuario'); 
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [comentariosCount, setComentariosCount] = useState(0);
  const obtenerComentariosCount = async () => {
    if (!comunidadId || !subComunidadId || !postId) return;
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
      const comentariosSnapshot = await getDocs(comentariosRef);
      setComentariosCount(comentariosSnapshot.size);
    } catch (error) {
      console.error("Error al obtener el número de comentarios:", error);
    }
  };

  const toggleComentarios = () => setMostrarComentarios((prev) => !prev);

  // Alternar contenido visible
  const toggleContenido = () => setMostrarTodo(!mostrarTodo);


  const obtenerReacciones = async () => {
    if (!comunidadId || !subComunidadId || !postId) {
      console.error("Error: Faltan identificadores para obtener el post.");
      return;
    }
  
    try {
      const postRef = doc(
        db,
        "Comunidades",
        comunidadId,
        "comunidades",
        subComunidadId,
        "posts",
        postId
      );
      const postSnap = await getDoc(postRef);
  
      if (postSnap.exists()) {
        const data = postSnap.data().reactions || [];
        setPostReactions(data);
  
        // Encontrar la reacción del usuario actual
        const userReaction = data.find((r) => r.userId === userId);
        if (userReaction) {
          setLastReaction(userReaction.reaction);
        } else {
          setLastReaction(null);
        }
      } else {
        console.log("No se encontró el post");
        setPostReactions([]);
        setLastReaction(null);
      }
    } catch (error) {
      console.error("Error al obtener las reacciones:", error);
    }
  };
  
  const guardarReaccion = async (reactionId) => {
    try {
      const postRef = doc(
        db,
        "Comunidades",
        comunidadId,
        "comunidades",
        subComunidadId,
        "posts",
        postId
      );
  
      const postSnap = await getDoc(postRef);
  
      if (!postSnap.exists()) {
        console.warn("El documento no existe, creándolo...");
        await setDoc(postRef, { reactions: [] }); // Estado inicial del documento
      }
  
      const data = postSnap.exists() ? postSnap.data() : { reactions: [] };
      const existingReactions = data.reactions || [];
  
      // Buscar si el usuario ya reaccionó
      const userReactionIndex = existingReactions.findIndex((r) => r.userId === userId);
  
      if (userReactionIndex !== -1) {
        // Si el usuario ya reaccionó, actualiza la reacción
        if (existingReactions[userReactionIndex].reaction === reactionId) {
          // Si la reacción seleccionada es la misma, elimina la reacción
          existingReactions.splice(userReactionIndex, 1);
          setLastReaction(null);
        } else {
          // Actualizar la reacción del usuario
          existingReactions[userReactionIndex].reaction = reactionId;
          setLastReaction(reactionId);
        }
      } else {
        // Si el usuario no ha reaccionado, añadir una nueva reacción
        existingReactions.push({ userId, reaction: reactionId });
        setLastReaction(reactionId);
      }
  
      // Actualizar en Firestore
      await updateDoc(postRef, { reactions: existingReactions });
  
      // Actualizar las reacciones locales
      obtenerReacciones();
    } catch (error) {
      console.error("Error al guardar/eliminar la reacción:", error);
    }
  };
  

  // Inicializar el campo `reactions` al crear un nuevo post
  const crearPost = async (comunidadId, subComunidadId, postId, postData) => {
    try {
      const docRef = doc(
        db,
        "Comunidades",
        comunidadId,
        "comunidades",
        subComunidadId,
        "posts",
        postId
      );
      await setDoc(docRef, { ...postData, fechaHora:new Date().toISOString(), reactions: [] }, { merge: true });
      console.log("Post creado correctamente");
    } catch (error) {
      console.error("Error al crear el post:", error);
    }
  };

  // Verificar y corregir posts existentes
 
  useEffect(() => {
    obtenerReacciones();
  }, [comunidadId, subComunidadId, postId]);

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
      setComentariosCount(snapshot.size); 
    });
  
    return () => unsubscribe(); 
  }, [comunidadId, subComunidadId, postId]);

  const reaccionesAgrupadas = reactions.map((reaction) => {
    const count = postReactions.filter((r) => r.reaction === reaction.id)
      .length;
    return { ...reaction, count };
  });

  const handleReactionClick = (id) => {
    setLastReaction((prev) => (prev === id ? null : id));
    setShowReactions(false);
    guardarReaccion(id);
  };
  

  const toggleReactions = () => setShowReactions((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (reactionRef.current && !reactionRef.current.contains(event.target)) {
        setShowReactions(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    obtenerComentariosCount();
  }, [comunidadId, subComunidadId, postId]);
  
    
    const formatearFecha = (fecha) => {
      return new Date(fecha).toLocaleString("es-ES", {
        dateStyle: "long",
        timeStyle: "short",
      });
    };

  const contenidoVisible = mostrarTodo
    ? contenido || "Sin contenido disponible"
    : contenido && contenido.length > limiteCaracteres
    ? contenido.slice(0, limiteCaracteres) + "..."
    : contenido || "Sin contenido disponible";

    return (
      <div className="post-container">
      {imagenPost && ( // Renderiza solo si hay una imagen
        <div className="post-image">
          <img src={imagenPost} alt="Post" />
        </div>
      )}
      <div className="post-contenido">
        <div className="post-header">
          <div className="post-info">
            <h2>{titulo}</h2>
            {fechaHora && (
              <p className="post-fecha-hora">{formatearFecha(fechaHora)}</p>
            )}
          </div>
          <div className="user-info">
            <img src={imagenUsuario || defaultUser} alt="Usuario" />
            <span>{nombreUsuario}</span>
          </div>
        </div>
        <span>
          <h5>{contenidoVisible}</h5>
          {contenido && contenido.length > limiteCaracteres && !mostrarTodo && (
            <span onClick={toggleContenido} className="ver-mas-link">
              Ver más
            </span>
          )}
        </span>
        {mostrarTodo && (
          <span onClick={toggleContenido} className="ver-menos-link">
            Ver menos
          </span>
        )}
        <div className="post-footer">
          <div className="reactions-summary">
            {reaccionesAgrupadas
              .filter((reaction) => reaction.count > 0)
              .map((reaction) => (
                <div key={reaction.id}>
                  <img src={reaction.icon} alt={reaction.label} />
                  <span>{reaction.count}</span>
                </div>
              ))}
          </div>
          <div className="post-footer">
            <div>
              <button className="icon-button" onClick={toggleComentarios}>
                <i className="fa fa-comment"></i>
                {comentariosCount}
              </button>
            </div>
            <div ref={reactionRef} style={{ position: "relative" }}>
              <button className="reaction-button" onClick={toggleReactions}>
                <div aria-hidden="true">
                  {lastReaction ? (
                    <img
                      src={
                        reactions.find((reaction) => reaction.id === lastReaction)
                          ?.icon || LikeGreyIcon
                      }
                      alt="Reacción actual"
                    />
                  ) : (
                    <i className="fa fa-thumbs-up" aria-hidden="true"></i>
                  )}
                </div>
              </button>
              {showReactions && (
                <div className="reaction-popup">
                  {reactions.map((reaction) => (
                    <div
                      key={reaction.id}
                      onClick={() => handleReactionClick(reaction.id)}
                    >
                      <img src={reaction.icon} alt={reaction.label} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {mostrarComentarios && (
            <div className="comentarios-contenedor">
              <Comentarios
                comunidadId={comunidadId}
                subComunidadId={subComunidadId}
                postId={postId}
                usuarioActual={sessionStorage.getItem("nombreUsuario")}
                mostrarComentarios={mostrarComentarios}
              />
            </div>
          )}
        </div>
      </div>
    </div>
    
      );
};

export default Post;