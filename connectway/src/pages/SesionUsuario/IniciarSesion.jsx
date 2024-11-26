import React, { useState } from "react";
import "../../estilos/SesionUsuario/IniciarSesion.css";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import authService from '../../Services/UsuarioServicios/VerificarUsuario';
import {guardarUsuario} from '../../Services/UsuarioServicios/GuardarUsuario';
import { obtenerNombreUsuario } from '../../Services/UsuarioServicios/NombreUsuarioPorIdDoc';
import ModalCargando from '../../components/Modal/ModalCargando'; 
import ModalNotificacion from '../../components/Modal/ModalNotificacion';

const IniciarSesion = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const navigate = useNavigate();

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
  };
  
  const usuarioExisteEnFirestore = async (email) => {
    try {
      const usuarioDocRef = doc(db, "Usuario", email); // Documento con el email como ID
      const docSnapshot = await getDoc(usuarioDocRef);
      return docSnapshot.exists(); // Retorna true si el documento existe
    } catch (error) {
      console.error("Error al verificar el usuario:", error);
      return false;
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmailOrUsername(value);

    // Arreglar Jere el value .length<20 xd, cambiar si sera aparte de @gmail.com
    if (value === "" || value.length < 20) {
      setEmailError("");
    } else if (!value.includes("@gmail.com")) {
      setEmailError("El correo es inválido");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
  };

  const handleEmailBlur = () => {
    if (emailOrUsername !== "" && !emailOrUsername.includes("@gmail.com")) {
      setEmailError("El correo es inválido");
    }
  };

  const handlePasswordBlur = () => {
    if (password === '' || password.length < 8) {
      setPasswordError('La contraseña no puede estar vacía o ser menor de 8 caracteres.');
    } else {
      setPasswordError('');
    }
  };

  async function veriUsuario(id) {
    const docRef = doc(db, "Usuario", id); // Suponiendo que 'usuarios' es tu colección y 'id' es el campo del documento
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
            setPasswordError("La contraseña es incorrecta");
            return true;
    } else {
      
      setEmailError("El correo no se encuentra registrado");
      return false;
    }
  }

  // Maneja el inicio de sesión con correo/usuario y contraseña
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailError('');
    setPasswordError('');
    
    try {
        const user = await authService.signInWithEmail(emailOrUsername, password);
        console.log('Usuario autenticado:', user);

        // Guardar el correo en sessionStorage
        sessionStorage.setItem('correoUsuario', emailOrUsername);

        const username = await obtenerNombreUsuario(emailOrUsername);
        sessionStorage.setItem('nombreUsuario', username);

        setIsLoading(false);
        navigate('/Home/0');
    } catch (error) {
        console.error('Error en inicio de sesión:', error.code);
        setIsLoading(false); 

        veriUsuario(emailOrUsername);
    }
};



  const removeDomain = (user2) => {
    const userName = user2.split("@")[0];
    console.log("name", userName);
    return userName;
  };
  // Maneja el inicio de sesión con Google
  const handleGoogleSignIn = async () => {
    try {
      const user = await authService.signInWithGoogle();
      const user2 = user.email;
      const userName = removeDomain(user2);

      // Verificar si el usuario ya existe
      const usuarioExiste = await usuarioExisteEnFirestore(user2);

      if (!usuarioExiste) {
        // Si no existe, lo guardamos
        await guardarUsuario(user2, userName);
      }

      sessionStorage.setItem("correoUsuario", user.email);

      navigate("/Home/0");
    } catch (error) {
      console.error("Error en inicio de sesión con Google:", error.message);
      alert("Error al iniciar sesión con Google: " + error.message);
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-content">
          <div className="login-box">
            <h1 className="welcome-message">
              Bienvenido a<span className="logo-text first-word">Connect</span>
              <span className="logo-text second-word">Way</span>
            </h1>
            <div className="login-box2">
              <h2>Iniciar Sesión</h2>
              <form onSubmit={handleEmailSignIn}>
                <label>
                  Correo electrónico
                  <span style={{ color: "red", marginLeft: "2px" }}>*</span>
                </label>
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
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
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
  
              <p>¿No tienes una cuenta? <a href="/CrearCuenta" className="create-login1">Crea una cuenta aquí</a></p>
              <p>O</p>
              <button className="google-button1" onClick={handleGoogleSignIn}>
                <img src={require('../../images/IconGo.png')} alt="Google Icon" className='editIcon' />
                Continuar con Google
              </button>
            </div>
          </div>
        </div>
        <ModalCargando
          isOpen={isLoading}
          onClose={() => {}}
          type="loading"
          message="Cargando, por favor espera... "
          iconClass="fa fa-spinner fa-spin" 
        />
        <ModalNotificacion
          isOpen={isModalNotificacionOpen}
          onClose={closeModalNotificacion}
          type={notificationType}
          message={notificationMessage}
          iconClass={notificationType === 'success' ? 'fa fa-check' : 'fa fa-exclamation'}
        />
      </div>
    </>
  );
}  
export default IniciarSesion;
