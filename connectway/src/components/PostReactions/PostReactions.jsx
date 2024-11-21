

import React, { useState, useEffect, useRef } from 'react';
import LikeIcon from '../../images/like.png'; // Icono azul de "Me gusta"
import LikeGreyIcon from '../../images/like-grey.png'; // Icono gris para "Me gusta"
import SadIcon from '../../images/sad.PNG'; // Icono para "Me Entristece"
import CareIcon from '../../images/care.png'; // Icono para "Me Importa"
import WowIcon from '../../images/wow.png'; // Icono para "Me Asombra"
import AngryIcon from '../../images/angry.png'; // Icono para "Me Enoja"
import HahaIcon from '../../images/haha.png'; // Icono para "Me Divierte"
import LoveIcon from '../../images/love.png'; // Icono para "Me Encanta"

// Definimos las reacciones disponibles
const reactions = [
    { id: 'like', label: 'Me gusta', icon: LikeIcon, count: 0 },
    { id: 'love', label: 'Me encanta', icon: LoveIcon, count: 0 },
    { id: 'care', label: 'Me importa', icon: CareIcon, count: 0 },
    { id: 'haha', label: 'Me divierte', icon: HahaIcon, count: 0 },
    { id: 'wow', label: 'Me asombra', icon: WowIcon, count: 0 },
    { id: 'sad', label: 'Me entristece', icon: SadIcon, count: 0 },
    { id: 'angry', label: 'Me enoja', icon: AngryIcon, count: 0 },
];

const PostReactions = () => {
    const [showReactions, setShowReactions] = useState(false);
    const [reactionCounts, setReactionCounts] = useState(reactions);
    const [lastReaction, setLastReaction] = useState(null); // Inicialmente no hay reacción
    const reactionRef = useRef(null);

    // Mostrar las opciones de reacciones al pasar el cursor
    const handleMouseEnter = () => {
        setShowReactions(true);
    };

    // Ocultar las opciones de reacciones al hacer clic fuera del componente
    const handleClickOutside = (event) => {
        if (reactionRef.current && !reactionRef.current.contains(event.target)) {
            setShowReactions(false);
        }
    };

    // Función para manejar el clic en una reacción
    const handleReactionClick = (id) => {
        if (lastReaction === id) {
            // Si el usuario hace clic en la misma reacción, la deselecciona
            setLastReaction(null);
            setShowReactions(false); // Ocultar las opciones de iconos desplegados
        } else {
            setLastReaction(id);
        }
        setShowReactions(false);
    };

    // Función para manejar el clic en el icono estático (deselección)
    const handleStaticIconClick = () => {
        if (lastReaction !== null) {
            // Deseleccionar la reacción y ocultar el desplegable
            setLastReaction(null);
            setShowReactions(false); // Ocultar las opciones de iconos desplegados
        }
    };

    // Definir el icono de la última reacción o el icono gris por defecto
    const lastReactionData = reactionCounts.find((reaction) => reaction.id === lastReaction);
    const lastReactionIcon = lastReactionData ? (
        <img src={lastReactionData.icon} alt={lastReactionData.label} style={{ width: '24px', height: '24px' }} />
    ) : (
        <div></div>
    );

    // Agregar y eliminar el evento de clic global
    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div
            ref={reactionRef}
            style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}
            onMouseEnter={handleMouseEnter}
        >
            {/* Botón de Reacción (última reacción seleccionada o icono gris) */}
            <button
                onClick={handleStaticIconClick}
                style={{
                    padding: '10px',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    backgroundColor: 'transparent', // Fondo transparente
                    border: '1px solid #ccc', // Borde del círculo
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                }}
            >
                {lastReactionIcon}
            </button>

            {/* Opciones de Reacciones (desplegable) */}
            {showReactions && (
                <div
                    style={{
                        display: 'flex',
                        padding: '10px',
                        background: '#fff',
                        borderRadius: '10px',
                        position: 'absolute',
                        bottom: '50px',
                        right: '0',
                        border: '1px solid #ddd',
                    }}
                >
                    {reactions.map((reaction) => (
                        <div key={reaction.id} onClick={() => handleReactionClick(reaction.id)} style={{ cursor: 'pointer', margin: '0 5px' }}>
                            <img src={reaction.icon} alt={reaction.label} style={{ width: '32px', height: '32px' }} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostReactions;
