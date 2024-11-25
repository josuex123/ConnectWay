import React, { useState } from 'react';
import '../../estilos/SesionUsuario/RecuperarContra.css';
import ModalNotificacion from '../../components/Modal/ModalNotificacion';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebaseConfig"; // Importa la configuración de Firebase
import ModalCargando from '../../components/Modal/ModalCargando'; 

function RecuperarContrasenia() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isModalNotificacionOpen, setIsModalNotificacionOpen] = useState(false);
  const [notificationType, setNotificationType] = useState('success'); 
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);  // Estado de carga

  const showModalNotificacion = (type, message) => {
    setNotificationType(type);
    setNotificationMessage(message);
    setIsModalNotificacionOpen(true);
  };

  const closeModalNotificacion = () => {
    setIsModalNotificacionOpen(false);
    window.location.href = "/IniciarSesion";
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (value === '') {
      setEmailError('');
    } else if (!value.includes('@')) {
      setEmailError('El correo es inválido');
    } else {
      setEmailError('');
    }
  };

  const handleEmailBlur = () => {
    if (email !== '' && !email.includes('@')) {
      setEmailError('El correo es inválido');
    }
  };

  const handleRecuperar = async (e) => {
    e.preventDefault();
    setEmailError(null);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('El correo es inválido');
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setIsLoading(false);
      showModalNotificacion('success', 'Si el correo está registrado, se enviará un enlace para restablecer la contraseña.');
    } catch (error) {
      setIsLoading(false);
      showModalNotificacion('error', 'Ocurrió un error al intentar enviar el correo. Inténtelo nuevamente.');
    }    
  };

  return (
    <>
      <div className="recover-container">
        <h1 className="welcome-message">
          Bienvenido a 
          <span className="logo-text first-word">Connect</span>
          <span className="logo-text second-word">Way</span>
        </h1>
        
        <div className="recover-box">
          <h2>¿Olvidaste tu contraseña?</h2>
          <h3>Te enviaremos un correo donde puedas restablecer la contraseña de tu cuenta.</h3>
          <form onSubmit={handleRecuperar}>
            <label>Correo electrónico</label>
            <input 
              type="email" 
              placeholder="Ingrese su correo electrónico" 
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              autoComplete="email"
              required 
            />
            {emailError && <p className="error-message">{emailError}</p>}
            <button type="submit" className="recover-button">
              Recuperar Contraseña
            </button>
          </form>
          <p>¿Ya tienes una cuenta? <a href="/IniciarSesion" className="create-login1">Iniciar Sesión</a></p>
        </div>
      </div>
      <ModalCargando
        isOpen={isLoading} 
        onClose={() => {}}
        type="loading"
        message="Cargando, por favor espera..."
        iconClass="fa fa-spinner fa-spin" 
      />
      <ModalNotificacion
        isOpen={isModalNotificacionOpen}
        onClose={closeModalNotificacion}
        type={notificationType}
        message={notificationMessage}
        iconClass={notificationType === 'success' ? 'fa fa-check' : 'fa fa-exclamation'}
      />
    </>
  );
};

export default RecuperarContrasenia;
