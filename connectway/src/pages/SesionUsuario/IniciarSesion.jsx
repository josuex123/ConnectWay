import React, { useState } from "react";
import "../../estilos/SesionUsuario/IniciarSesion.css";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import authService from "../../Services/UsuarioServicios/VerificarUsuario";
import { guardarUsuario } from "../../Services/UsuarioServicios/GuardarUsuario";
import { obtenerNombreUsuario } from "../../Services/UsuarioServicios/NombreUsuarioPorIdDoc";
import ModalCargando from "../../components/Modal/ModalCargando";
import ModalNotificacion from "../../components/Modal/ModalNotificacion";

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
  const [notificationType, setNotificationType] = useState("success");
  const [notificationMessage, setNotificationMessage] = useState("");

  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

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
    if (value === "" || value.length < 100) {
      setEmailError("");
      setEmailValid(false);
    } else if (!value.includes("@gmail.com")) {
      setEmailError("El correo es inválido");
      setEmailValid(false);
    } else {
      setEmailError("");
      setEmailValid(true);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
  };

  const handleEmailBlur = () => {
    if (emailOrUsername !== "" && !emailOrUsername.includes("@gmail.com")) {
      setEmailError("El correo es inválido");
      setEmailValid(false);
    } else {
      setEmailError("");
      setEmailValid(true);
    }
  };

  const handlePasswordBlur = () => {
    if (password === "" || password.length < 8) {
      setPasswordError(
        "La contraseña tiene que ser mínimo de 8 a 15 caracteres."
      );
      setPasswordValid(false);
    } else {
      setPasswordError("");
      setPasswordValid(true);
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

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailError("");
    setPasswordError("");

    try {
      const user = await authService.signInWithEmail(emailOrUsername, password);
      console.log("Usuario autenticado:", user);

      sessionStorage.setItem("correoUsuario", emailOrUsername);

      const username = await obtenerNombreUsuario(emailOrUsername);
      sessionStorage.setItem("nombreUsuario", username);

      setIsLoading(false);
      navigate("/Home/0");
    } catch (error) {
      console.error("Error en inicio de sesión:", error.code);
      setIsLoading(false);

      veriUsuario(emailOrUsername);
    }
  };

  const removeDomain = (user2) => {
    const userName = user2.split("@")[0];
    console.log("name", userName);
    return userName;
  };

  const handleGoogleSignIn = async () => {
    try {
      const user = await authService.signInWithGoogle();
      const user2 = user.email;
      const userName = removeDomain(user2);

      const usuarioExiste = await usuarioExisteEnFirestore(user2);

      if (!usuarioExiste) {
        await guardarUsuario(user2, userName);
      }

      sessionStorage.setItem("correoUsuario", user.email);
      sessionStorage.setItem("nombreUsuario", userName);
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
                  style={{
                    border: emailValid
                      ? "2px solid #28a745"
                      : emailError
                      ? "2px solid red"
                      : "1px solid gray",
                  }}
                />
                {emailError && <p className="error-message">{emailError}</p>}

                <label>
                  Contraseña
                  <span style={{ color: "red", marginLeft: "2px" }}>*</span>
                </label>
                <div className="password-field">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    required
                    style={{
                      border: passwordValid
                        ? "2px solid #28a745"
                        : passwordError
                        ? "2px solid red"
                        : "1px solid gray",
                    }}
                  />
                </div>
                {passwordError && (
                  <p className="error-message">{passwordError}</p>
                )}

                <div className="password-toggle">
                  <img
                    src={
                      isPasswordVisible
                        ? require("../../images/casilla1.png")
                        : require("../../images/casilla.png")
                    }
                    alt="Mostrar/ocultar contraseña"
                    className="editIcon1"
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer", marginTop: "-15px" }}
                  />
                  <span className="show-password-text">Mostrar Contraseña</span>
                </div>

                <a href="/RecuperarContrasenia" className="forgot-password1">
                  ¿Olvidaste tu contraseña?
                </a>

                <button type="submit" className="login-button">
                  Iniciar Sesión
                </button>
              </form>

              <p>
                ¿No tienes una cuenta?{" "}
                <a href="/CrearCuenta" className="create-login1">
                  Crea una cuenta aquí
                </a>
              </p>
              <p>O</p>
              <button className="google-button1" onClick={handleGoogleSignIn}>
                <img
                  src={require("../../images/IconGo.png")}
                  alt="Google Icon"
                  className="editIcon"
                />
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
          iconClass={
            notificationType === "success" ? "fa fa-check" : "fa fa-exclamation"
          }
        />
      </div>
    </>
  );
};
export default IniciarSesion;
