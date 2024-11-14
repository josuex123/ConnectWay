import React,{useState} from 'react';
import './CrearCuenta.css';

const CrearCuenta = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
    };

    const handleEmailChange = (e) => {
      const value = e.target.value;
      setEmail(value);

      if(!value.includes('@')){
        serEmailError('El correo debe contener un @');
      }else{
        setEmailError('');
      }
    }

  return (
    <div className="register-container">
      <h1 className="welcome-message">Bienvenido a 
           <span className="logo-text first-word">Connect</span>
           <span className="logo-text second-word">Way</span>
       </h1>
       
      <div className="register-box">
        <h3>Crea una cuenta</h3>
        <form>
          <label>Nombre completo</label>
          <input type="text" placeholder="Ingrese su nombre completo" required />

          <label>Usuario</label>
          <input type="text" placeholder="Ingrese un usuario" required />

          <label>Correo electrónico</label>
          <input type="email" placeholder="Ingrese su correo electrónico" required />

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
              style={{ cursor: 'pointer',marginTop: '-15px' }}
            />
          </div>

          <label>Confirmar contraseña</label>
          <div className="password-field">
            <input 
              type={isPasswordVisible ? "text" : "password"} 
              placeholder="Confirme su contraseña" 
              required 
            />

            <img 
              src={isPasswordVisible ? require('../../images/ojo2.png') : require('../../images/ojo1.png')} 
              alt="Mostrar/ocultar contraseña" 
              className="editIcon" 
              onClick={togglePasswordVisibility} 
              style={{ cursor: 'pointer',marginTop: '-15px' }}
            />
          </div>

          <div className="terms">
            <input type="checkbox" required />
            <label className="terms-label1" >He leído y acepto los <a href="/terms">Términos y Condiciones</a></label>
          </div>

          <button type="submit" className="register-button">Registrarse</button>
        </form>
        <div className='crear-of-ini'>
            <p>¿Ya tienes una cuenta? <a href="/IniciarSesion" className="create-login1">Iniciar Sesion</a></p>
        </div>
      </div>
    </div>
  );
};

export default CrearCuenta;
