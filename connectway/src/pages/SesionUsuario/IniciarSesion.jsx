import React, { useState } from 'react';
import '../../estilos/SesionUsuario/IniciarSesion.css';
import { useNavigate } from 'react-router-dom';
import authService from '../../Services/UsuarioServicios/VerificarUsuario'; 

const IniciarSesion = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate()
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Maneja el inicio de sesión con correo/usuario y contraseña
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      const user = await authService.signInWithEmail(emailOrUsername, password);
      console.log('Usuario autenticado:', user);
      navigate('/Home/0');
    } catch (error) {
      console.error('Error en inicio de sesión:', error.message);
      alert('Error al iniciar sesión: ' + error.message);
    }
  };

  // Maneja el inicio de sesión con Google
  const handleGoogleSignIn = async () => {
    try {
      const user = await authService.signInWithGoogle();
      console.log('Usuario autenticado con Google:', user);
      navigate('/Home/0');
    } catch (error) {
      console.error('Error en inicio de sesión con Google:', error.message);
      alert('Error al iniciar sesión con Google: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <h1 className="welcome-message">
        Bienvenido a 
        <span className="logo-text first-word">Connect</span>
        <span className="logo-text second-word">Way</span>
      </h1>
      
      <div className="login-box">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleEmailSignIn}>
          <label>Usuario</label>
          <input 
            type="text" 
            placeholder="Ingrese su usuario o correo" 
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            required 
          />

          <label>Contraseña</label>
          <div className="password-field">
            <input 
            
              type={isPasswordVisible ? "text" : "password"} 
              placeholder="Ingrese su contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <a href="/RecuperarContrasenia" className="forgot-password1">¿Olvidaste tu contraseña?</a>

          <button type="submit" className="login-button">Iniciar Sesión</button>
        </form>

        <p>¿No tienes una cuenta? <a href="/CrearCuenta" className="create-login1">Crea una</a></p>
        <p>O</p>
        <button className="google-button1" onClick={handleGoogleSignIn}>
          <img src={require('../../images/IconGo.png')} alt="Google Icon" className='editIcon' />
          Continuar con Google
        </button>
      </div>
    </div>
  );
};

export default IniciarSesion;
