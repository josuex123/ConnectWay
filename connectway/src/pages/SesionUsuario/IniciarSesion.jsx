import React, { useState } from 'react';
import '../../estilos/SesionUsuario/IniciarSesion.css';
import { useNavigate } from 'react-router-dom';
import authService from '../../Services/UsuarioServicios/VerificarUsuario';
import {guardarUsuario} from '../../Services/UsuarioServicios/GuardarUsuario';
import { obtenerNombreUsuario } from '../../Services/UsuarioServicios/NombreUsuarioPorIdDoc';
import ModalCargando from '../../components/Modal/ModalCargando'; 

const IniciarSesion = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  // Estado de carga
  const navigate = useNavigate();
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmailOrUsername(value);

    // Arreglar Jere el value .length<20 xd, cambiar si sera aparte de @gmail.com
    if(value === '' || value.length < 20){
        setEmailError(''); 
    }else if(!value.includes('@gmail.com')){
        setEmailError('El correo es inválido');
    }else{
        setEmailError('');
    }
  };

  const handleEmailBlur = () => {
    if(emailOrUsername !== '' && !emailOrUsername.includes('@gmail.com')){
        setEmailError('El correo es inválido');
    }
  };

  // Maneja el inicio de sesión con correo/usuario y contraseña
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await authService.signInWithEmail(emailOrUsername, password);
      console.log('Usuario autenticado:', user);

      // Guardar el correo en sessionStorage
      sessionStorage.setItem('correoUsuario', emailOrUsername);

      const username = await obtenerNombreUsuario(emailOrUsername);

      sessionStorage.setItem('nombreUsuario', username);

      navigate('/Home/0');
    } catch (error) {
      setIsLoading(false);
      
      console.error('Error en inicio de sesión:', error.message);
      alert('Error al iniciar sesión: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeDomain = (user2) => {
    const userName =user2.split("@")[0]; ;
    console.log("name",userName)
    return  userName;
  };
  // Maneja el inicio de sesión con Google
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const user = await authService.signInWithGoogle();
      const user2 = user.email;
      const userName = removeDomain(user2);
  
      // Verificar si el usuario ya existe
      const usuarioExiste = await verificarUsuario(user2);
  
      if (!usuarioExiste) {
        // Si no existe, lo guardamos
        await guardarUsuario(user2, userName);
      }
  
      sessionStorage.setItem('correoUsuario', user.email);
      setIsLoading(false);
      navigate('/Home/0');
    } catch (error) {
      console.error('Error en inicio de sesión con Google:', error.message);
      alert('Error al iniciar sesión con Google: ' + error.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="login-container">
        <h1 className="welcome-message">
          Bienvenido a 
          <span className="logo-text first-word">Connect</span>
          <span className="logo-text second-word">Way</span>
        </h1>
        
        <div className="login-box">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleEmailSignIn}>
            <label>Correo electrónico<span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
            <input 
              type="email" 
              placeholder="Ingrese su correo electrónico" 
              value={emailOrUsername}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              autoComplete="email"
              required 
            />
            {emailError && <p className="error-message">{emailError}</p>}

            <label>Contraseña<span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
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
      <ModalCargando
        isOpen={isLoading} 
        onClose={() => {}}
        type="loading"
        message="Cargando, por favor espera...\n "
        iconClass="fa fa-spinner fa-spin" 
      />
    </>
  );
};

export default IniciarSesion;
