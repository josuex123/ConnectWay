import React, {useState} from 'react';
import '../../estilos/SesionUsuario/IniciarSesion.css';

const IniciarSesion = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [ user,setUser ] = useState(null);
  const [ userError,setUserError ] = useState(null);
  const [ password,setPassword ] = useState(null);
  const [passwordError, setPasswordError] = useState(null);


  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleUserNameChange = (e) => {
    const value = e.target.value;
    setUser(value);
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
  }

  const handleIniciarSesion = (e) => {
    e.preventDefault();
    setPasswordError(null);
    setUserError(null);
    const datos = { userDB: '', passwordDB:'' };
    datos.userDB = 'usuarioPrue';
    datos.passwordDB = 'blabla';

    if(datos.userDB !== user){
      setUserError('No existe ninguna cuenta con ese nombre de usuario');
    }else{
      if(datos.userDB === user && datos.passwordDB !== password){
        setPasswordError('La contraseña es incorrecta, vuelva a intentarlo');
      }else{
        //AQUI REDIRECCIONAR EL USUARIO
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
        <h2>Iniciar Sesión</h2>
        <form onSubmit={ handleIniciarSesion }>
          <label>Usuario</label>
          <input type="text" placeholder="Ingrese un usuario" 
            onChange={ handleUserNameChange }
            required
          />
          {userError && <p className="error-message">{userError}</p>}

          <label>Contraseña</label>
          <div className="password-field">
            <input 
              type={isPasswordVisible ? "text" : "password"} 
              placeholder="Ingrese su contraseña"
              value = {password}
              onChange= { handlePasswordChange }
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

          <button type="submit" className="login-button">
                    Iniciar Sesión
          </button>
        </form>

        <p>¿No tienes una cuenta? <a href="/CrearCuenta" className="create-login1" >Crea una</a></p>
        <p>ó</p>
        <button className="google-button1">
        <img src={require('../../images/IconGo.png')} alt="Google Icon" className='editIcon' />
           Continúe con Google
        </button>
      </div>
    </div>
  );
};

export default IniciarSesion;
