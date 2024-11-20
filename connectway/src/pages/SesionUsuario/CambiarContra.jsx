import React, { useState, useEffect } from 'react';
import '../../estilos/SesionUsuario/CambiarContra.css';
import ModalNotificacion from '../../components/Modal/ModalNotificacion';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const CambiarContra = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [isModalNotificacionOpen, setIsModalNotificacionOpen] = useState(false);
  const [notificationType, setNotificationType] = useState('success');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [oobCode, setOobCode] = useState('');

  // Extraer el código de restablecimiento de la URL
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('oobCode');
    if (code) {
      setOobCode(code);
    } else {
      showModalNotificacion('error', 'El enlace de restablecimiento no es válido.');
    }
  }, []);

  const showModalNotificacion = (type, message) => {
    setNotificationType(type);
    setNotificationMessage(message);
    setIsModalNotificacionOpen(true);
  };

  const closeModalNotificacion = async () => {
    setIsModalNotificacionOpen(false);
    window.location.href = '/IniciarSesion';
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    let error = '';
    if (!/[0-9]/.test(value)) {
      error = 'La contraseña debe contener al menos un número.';
    } else if (!/[A-Z]/.test(value)) {
      error = 'La contraseña debe contener al menos una letra mayúscula.';
    } else if (!/[a-z]/.test(value)) {
      error = 'La contraseña debe contener al menos una letra minúscula.';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      error = 'La contraseña debe contener al menos un carácter especial.';
    }
    setPasswordError(error);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const validateForm = () => {
    let valid = true;

    if (!password || passwordError) valid = false;

    if (password !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden.');
      valid = false;
    } else {
      setConfirmPasswordError('');
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log('Por favor, corrige los errores antes de enviar.');
      return;
    }

    if (!oobCode) {
      showModalNotificacion('error', 'El enlace de restablecimiento no es válido.');
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, password);
      showModalNotificacion('success', 'Se ha cambiado la contraseña exitosamente.');
    } catch (error) {
      console.error(error);
      showModalNotificacion(
        'error',
        'No se pudo cambiar la contraseña. El enlace podría haber expirado.'
      );
    }
  };

  return (
    <>
      <div className="change-container">
        <h1 className="welcome-message">
          Bienvenido a
          <span className="logo-text first-word">Connect</span>
          <span className="logo-text second-word">Way</span>
        </h1>

        <div className="change-box">
          <h2>Cambia tu Contraseña</h2>
          <form onSubmit={handleSubmit}>
            <label>Contraseña</label>
            <div className="password-field">
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              <img
                src={isPasswordVisible ? require('../../images/ojo2.png') : require('../../images/ojo1.png')}
                alt="Mostrar/ocultar contraseña"
                className="editIcon"
                onClick={togglePasswordVisibility}
                style={{ cursor: 'pointer', marginTop: '-15px' }}
              />
            </div>
            {passwordError && <p className="error-message">{passwordError}</p>}

            <label>Confirmar contraseña</label>
            <div className="password-field">
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder="Confirme su contraseña"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
              <img
                src={isPasswordVisible ? require('../../images/ojo2.png') : require('../../images/ojo1.png')}
                alt="Mostrar/ocultar contraseña"
                className="editIcon"
                onClick={togglePasswordVisibility}
                style={{ cursor: 'pointer', marginTop: '-15px' }}
              />
            </div>
            {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}

            <button type="submit" className="change-button">
              Restablecer Contraseña
            </button>
          </form>
        </div>
      </div>
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

export default CambiarContra;
