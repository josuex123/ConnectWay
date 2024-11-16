import React,{useState} from 'react';
import './CrearCuenta.css';
import { useNavigate } from 'react-router-dom';

const CrearCuenta = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const navigate = useNavigate();
 
    const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
    };

    const handleEmailChange = (e) => {
      const value = e.target.value;
      setEmail(value);

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
      if(email !== '' && !email.includes('@gmail.com')){
          setEmailError('El correo es inválido');
      }
  };

  const handlePasswordChange = (e) =>{
    const value = e.target.value;
    setPassword(value);

    let error = '';
    if(!/[0-9]/.test(value)){
      error = 'La contraseña debe contener al menos un número.';
        } else if (!/[A-Z]/.test(value)) {
            error = 'La contraseña debe contener al menos una letra mayúscula.';
        } else if (!/[a-z]/.test(value)) {
            error = 'La contraseña debe contener al menos una letra minúscula.';
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            error = 'La contraseña debe contener al menos un carácter especial.';
        }
    setPasswordError(error);
  }
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e) => {
     e.preventDefault();
      
      let valid = true;
      if (!email || emailError) valid = false;
      if (!password || passwordError) valid = false;
      if (password !== confirmPassword) {
          setConfirmPasswordError('Las contraseñas no coinciden.');
          valid = false;
        }else{
          setConfirmPasswordError('');
        }
      

      if (valid) {
        console.log('Formulario enviado');
        navigate('/Home/0');
      } else {
        console.log('Por favor, corrige los errores antes de enviar.');
      }

  };

  return (
    <div className="register-container">
      <h1 className="welcome-message">Bienvenido a 
           <span className="logo-text first-word">Connect</span>
           <span className="logo-text second-word">Way</span>
       </h1>
       
      <div className="register-box">
        <h2>Crea una cuenta</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre completo</label>
          <input type="text" placeholder="Ingrese su nombre completo" required />

          <label>Usuario</label>
          <input type="text" placeholder="Ingrese un usuario" required />

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


          <label>Contraseña</label>
          <div className="password-field">
            <input 
              type={isPasswordVisible ? "text" : "password"} 
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
              style={{ cursor: 'pointer',marginTop: '-15px' }}
            />
          </div>

          {passwordError && <p className="error-message">{passwordError}</p>}

          <label>Confirmar contraseña</label>
          <div className="password-field">
            <input 
              type={isPasswordVisible ? "text" : "password"} 
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
              style={{ cursor: 'pointer',marginTop: '-15px' }}
            />
          </div>

          {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
          
          <div className="terms">
            <input type="checkbox" required />
            <label className="terms-label1" >He leído y acepto los <a href="/terms">Términos y Condiciones</a></label>
          </div>

          <button type="submit" className="register-button">Registrarse

          </button>
        </form>
        <div className='crear-of-ini'>
            <p>¿Ya tienes una cuenta? <a href="/IniciarSesion" className="create-login1">Iniciar Sesion</a></p>
        </div>
      </div>
    </div>
  );
};

export default CrearCuenta;
