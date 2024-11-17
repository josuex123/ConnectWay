import React, {useState} from 'react';
import '../../estilos/SesionUsuario/RecuperarContra.css';
import ModalNotificacion from '../../components/Modal/ModalNotificacion';


function RecuperarContrasenia() {
  const [ email,setEmail ] = useState(null);
  const [ emailError,setEmailError ] = useState(null);

  const [isModalNotificacionOpen, setIsModalNotificacionOpen] = useState(false);
  const [notificationType, setNotificationType] = useState('success'); 
  const [notificationMessage, setNotificationMessage] = useState('');

  const showModalNotificacion = (type, message) => { 
    setNotificationType(type);
    setNotificationMessage(message); 
    setIsModalNotificacionOpen(true);
  };

  const closeModalNotificacion = async () => {
      setIsModalNotificacionOpen(false);
      window.location.href = "/IniciarSesion";
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

  const handleRecuperar = (e) => { //AQUI CONTROLAR SI EXISTE EL CORREO CON LA BD
    e.preventDefault();
    setEmailError(null);
    
    const emailDB = 'correo@gmail.com';
    if(email !== emailDB){
      setEmailError('No existe ninguna cuenta vinculada a este correo electrónico');
    }else{
      //en esta linea mandar el link seguro de restablecer contra
      showModalNotificacion('success', 'Se ha enviado el link de restablecimiento a su correo electronico');
    }
  }

  return (
    <>
      <div className="recover-container">
        <h1 className="welcome-message">Bienvenido a 
            <span className="logo-text first-word">Connect</span>
            <span className="logo-text second-word">Way</span>
        </h1>
        
        
        <div className="recover-box">
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
            <button type="submit" className="recover-button">
                      Recuperar Contraseña
            </button>
          </form>
          <p>¿Ya tienes una cuenta? <a href="/IniciarSesion" className="create-login1">Iniciar Sesión</a></p>
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

export default RecuperarContrasenia