import React, {useState} from 'react';
import '../../estilos/SesionUsuario/RecuperarContra.css';

function RecuperarContrasenia() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [ email,setEmail ] = useState(null);
  const [ password,setPassword ] = useState(null);
  const [ emailError,setEmailError ] = useState(null);
  const [ passwordError, setPasswordError] = useState(null);

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

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
  }

  const handleRecuperar = (e) => {
    e.preventDefault();
    setPasswordError(null);
    setUserError(null);
    

    if(true){
      setEmailError('No existe ninguna cuenta con ese nombre de usuario');
    }else{
      if(true){
        setPasswordError('La contraseña es incorrecta, vuelva a intentarlo');
      }else{
        //AQUI REDIRECCIONAR EL USUARIO
        window.location.href = '/Home/1';
      }
    }
  }

  return (
    <div className="login-container">
       <h1 className="welcome-message">Bienvenido a 
           <span className="logo-text first-word">Connect</span>
           <span className="logo-text second-word">Way</span>
       </h1>
       
      
      <div className="login-box">
        <h2>Olvidaste tu contraseña?</h2>
        <h3>Te enviaremos un correo donde puedas restablecer la contraseña de tu cuenta.</h3>
        <form onSubmit={ handleRecuperar }>
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
          <button type="submit" className="login-button">
                    Recuperar Contraseña
          </button>
        </form>
        <p>¿Ya tienes una cuenta? <a href="/IniciarSesion" className="create-login1">Iniciar Sesión</a></p>
      </div>
    </div>
  );
};

export default RecuperarContrasenia