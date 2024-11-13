import React, {useState} from 'react';
import './IniciarSesion.css';


const IniciarSesion = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  return (
    <div className="login-container">
      <h2>Bienvenido a ConnectWay</h2>
      <div className="login-box">
        <h3>Iniciar Sesion</h3>
        <form>
          <label>Usuario</label>
          <input type="email" placeholder="Ingrese su usuario" required />

          <label>Contraseña</label>
          <div className="password-field">

          <input 
              type={isPasswordVisible ? "text" : "password"} 
              placeholder="Ingrese su contraseña" 
              required 
            />

            <img 
              src={isPasswordVisible ? require('../../images/ojo2.png') : require('../../images/ojo1.png')} 
              alt="Mostrar/ocultar contraseña" 
              className="editIcon" 
              onClick={togglePasswordVisibility} 
              style={{ cursor: 'pointer' }}
            />
          </div>

          <a href="/" className="forgot-password1">¿Olvidaste tu contraseña?</a>

          <button type="submit" className="login-button">Iniciar Sesion</button>
        </form>

        <p>¿No tienes una cuenta? <a href="/register" className="create-login1" >Crea una</a></p>
        <p>OR</p>
        <button className="google-button1">
        <img src={require('../../images/IconGo.png')} alt="Google Icon" className='editIcon' />
           Continue con Google
        </button>
      </div>
    </div>
  );
};

export default IniciarSesion;
