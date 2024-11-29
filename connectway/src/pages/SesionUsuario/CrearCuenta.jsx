import React, { useState } from "react";
import "../../estilos/SesionUsuario/CrearCuenta.css";
import { useNavigate } from "react-router-dom";
import registrarUsuario from "../../Services/UsuarioServicios/RegistrarUsuarioCorreoContraseña";
import { guardarUsuario } from "../../Services/UsuarioServicios/GuardarUsuario";
import { verificarNombreUsuarioExistente } from "../../Services/UsuarioServicios/VerificarNombreUsuarioExistente";
import ModalCargando from "../../components/Modal/ModalCargando";
import ModalNotificacion from "../../components/Modal/ModalNotificacion";
import ModalTerms from "./TerminosCondiciones";

const CrearCuenta = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [user, setUser] = useState("");
  const [userError, setUserError] = useState(""); // Estado para el error del usuario
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const navigate = useNavigate();

  const [isModalNotificacionOpen, setIsModalNotificacionOpen] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [checkboxActive, setCheckboxActive] = useState(false);

  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const closeTerms = async () => {
    setIsTermsOpen(false);
  };
  const showTerms = async () => {
    setIsTermsOpen(true);
  };

  const handleShowTerms = () => {
    if (!checkboxActive) {
      showTerms();
      setCheckboxActive(true);
    } else {
      setCheckboxActive(false);
    }
  };

  const showModalNotificacion = (type, message) => {
    setNotificationType(type);
    setNotificationMessage(message);
    setIsModalNotificacionOpen(true);
  };

  const closeModalNotificacion = async () => {
    setIsModalNotificacionOpen(false);
    navigate("/home/0");
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;

    const namePart = value.split("@")[0];
    const domainPart = value.split("@")[1];

    if (namePart.length > 64) {
      setEmailError(
        "El nombre del correo no puede tener más de 64 caracteres."
      );
      return;
    }

    if (value.length > 254) {
      setEmailError("El correo no puede tener más de 254 caracteres.");
      setEmail(value.slice(0, 254));
      return;
    }

    if (domainPart && domainPart.length > 30) {
      setEmailError("El dominio no puede tener más de 30 caracteres.");
      return;
    }

    setEmail(value);
    setEmailError("");

    {
      /*const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value !== "" && !emailRegex.test(value)) {
      setEmailError("El correo es inválido");
    }
    */
    }
  };

  const handleEmailBlur = () => {
    const emailRegex =
      /^[a-zA-Z0-9](\.?[a-zA-Z0-9]){0,63}@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;

    if (email.length > 254) {
      setEmailError("El correo no puede tener más de 254 caracteres.");
      return;
    }

    const namePart = email.split("@")[0];
    if (namePart.length > 64) {
      setEmailError(
        "El nombre del correo no puede tener más de 64 caracteres."
      );
      return;
    }

    if (email !== "" && !emailRegex.test(email)) {
      setEmailError("El correo es inválido.");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;

    const filteredValue = value.replace(/[^a-zA-Z0-9.,;:!¡¿?()#@_\-]/g, "");

    let error = "";

    if (filteredValue.length > 15) {
      error = "La contraseña no puede exceder los 15 caracteres.";
    } else if (!/[0-9]/.test(filteredValue)) {
      error = "La contraseña debe contener al menos un número.";
    } else if (!/[A-Z]/.test(filteredValue)) {
      error = "La contraseña debe contener al menos una letra mayúscula.";
    } else if (!/[a-z]/.test(filteredValue)) {
      error = "La contraseña debe contener al menos una letra minúscula.";
    } else if (!/[.,;:!¡¿?()#@_\-]/.test(filteredValue)) {
      error =
        "La contraseña debe contener al menos uno de estos caracteres especiales: . , ; : ! ¡ ¿ ? ( ) # @ - _";
    }

    setPasswordError(error);

    if (filteredValue.length <= 15) {
      setPassword(filteredValue);
    }
  };

  const handlePasswordBlur = () => {
    if (password.length === 0) {
      setPasswordError("");
    } else if (password.length < 8 || password.length > 15) {
      setPasswordError(
        "La contraseña tiene que ser mínimo de 8 a 15 caracteres."
      );
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleUserNameChange = async (e) => {
    let value = e.target.value;

    const specialChars = value.match(/[\s._-]/g);
    const specialCharCount = specialChars ? specialChars.length : 0;

    if (specialCharCount > 2) {
      setUserError(
        "El nombre de usuario no puede tener más de 2 caracteres especiales."
      );
      return;
    }

    if (value.length > 20) {
      value = value.slice(0, 20);
      setUserError("El nombre de usuario no puede tener más de 20 caracteres.");
    }

    const allowedCharsRegex = /^[a-zA-Z0-9\s._-]*$/;
    if (!allowedCharsRegex.test(value)) {
      setUserError(
        "El nombre de usuario solo puede incluir letras, números y 2 caracteres especiales permitidos (espacio, guion, guion bajo, punto)."
      );
      return;
    }

    setUser(value);
    value = value.trimEnd();

    if (value.trim() !== "") {
      const usuarioExistente = await verificarNombreUsuarioExistente(value);
      if (usuarioExistente) {
        setUserError("El nombre de usuario ya existe. Intenta con otro.");
      } else {
        setUserError("");
      }
    } else {
      setUserError("");
    }
  };

  const handleNameChange = (e) => {
    let value = e.target.value;

    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$/;
    if (!regex.test(value)) {
      setNameError("El nombre solo puede contener letras y espacios.");
      return;
    }
    setName(value);
    value = value.trimEnd();

    if (value.length > 40) {
      value = value.slice(0, 40);
      setNameError("El nombre no puede tener más de 40 caracteres.");
    } else {
      setNameError("");
    }
  };

  const validateForm = () => {
    let valid = true;

    if (!email || emailError) valid = false;
    if (!password || passwordError) valid = false;

    if (password !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden.");
      valid = false;
    } else {
      setConfirmPasswordError("");
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("Por favor, corrige los errores antes de enviar.");
      return;
    }

    if (userError != "") {
      alert(
        'Por favor, corrige los errores en el campo "Usuario" antes de enviar.'
      );
      return;
    }

    setIsLoading(true); // modal de carga o algo
    try {
      const response = await registrarUsuario(email, password);

      if (response.email) {
        const guardarUsuarioPromise = guardarUsuario(response.email, user);

        await guardarUsuarioPromise; // Espera solo si es esencial
        sessionStorage.setItem("correoUsuario", emailOrUsername);

        const username = await obtenerNombreUsuario(emailOrUsername);

        sessionStorage.setItem("nombreUsuario", username);
      } else if (response.error) {
        showModalNotificacion("error", "No se pudo crear la cuenta");
      }
    } catch (error) {
      showModalNotificacion("error", "No se pudo procesar el formulario");
    } finally {
      setIsLoading(false);
      showModalNotificacion("success", "Se ha creado la cuenta exitosamente");
    }
  };

  return (
    <>
      <div className="register-container">
        <div className="login-content">
          <div className="login-box">
            <h1 className="welcome-message">
              Bienvenido a<span className="logo-text first-word">Connect</span>
              <span className="logo-text second-word">Way</span>
            </h1>

            <div className="register-box">
              <h2>Crea una cuenta</h2>
              <form onSubmit={handleSubmit}>
                <label>
                  Nombre completo
                  <span style={{ color: "red", marginLeft: "2px" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ingrese su nombre completo"
                  value={name}
                  onChange={handleNameChange}
                  required
                />
                {nameError && <p className="error-message">{nameError}</p>}

                <label>
                  Usuario
                  <span style={{ color: "red", marginLeft: "2px" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ingrese un usuario"
                  value={user}
                  onChange={handleUserNameChange}
                  required
                />
                {userError && <p className="error-message">{userError}</p>}

                <label>
                  Correo electrónico
                  <span style={{ color: "red", marginLeft: "2px" }}>*</span>
                </label>
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
                  />
                  <img
                    src={
                      isPasswordVisible
                        ? require("../../images/ojo2.png")
                        : require("../../images/ojo1.png")
                    }
                    alt="Mostrar/ocultar contraseña"
                    className="editIcon"
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer", marginTop: "-15px" }}
                  />
                </div>

                {passwordError && (
                  <p className="error-message">{passwordError}</p>
                )}

                <label>
                  Confirmar contraseña
                  <span style={{ color: "red", marginLeft: "2px" }}>*</span>
                </label>
                <div className="password-field">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="Confirme su contraseña"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                  />

                  <img
                    src={
                      isPasswordVisible
                        ? require("../../images/ojo2.png")
                        : require("../../images/ojo1.png")
                    }
                    alt="Mostrar/ocultar contraseña"
                    className="editIcon"
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer", marginTop: "-15px" }}
                  />
                </div>

                {confirmPasswordError && (
                  <p className="error-message">{confirmPasswordError}</p>
                )}

                <div className="terms">
                  <input type="checkbox" required onClick={handleShowTerms} />
                  <label className="terms-label1">
                    He leído y acepto los{" "}
                    <span
                      onClick={showTerms}
                      style={{
                        color: "blue",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      Términos y Condiciones
                    </span>
                  </label>
                </div>

                <button type="submit" className="register-button">
                  Registrarse
                </button>
              </form>
              <div className="crear-of-ini">
                <p>
                  ¿Ya tienes una cuenta?{" "}
                  <a href="/IniciarSesion" className="create-login1">
                    Iniciar Sesión
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="login-image">
            <img
              src={require("../../images/imagenInicio1.png")}
              alt="Login Visual"
            />
          </div>
        </div>
      </div>
      <ModalCargando
        isOpen={isLoading}
        onClose={() => {}}
        type="loading"
        message="Cargando, por favor espera..."
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
      <ModalTerms isOpen={isTermsOpen} onClose={closeTerms} />
    </>
  );
};

export default CrearCuenta;
