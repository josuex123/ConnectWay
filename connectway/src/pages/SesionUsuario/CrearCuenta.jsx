import React, { useState } from "react";
import "../../estilos/SesionUsuario/CrearCuenta.css";
import { useNavigate } from "react-router-dom";
import registrarUsuario from "../../Services/UsuarioServicios/RegistrarUsuarioCorreoContraseña";
import { guardarUsuario } from "../../Services/UsuarioServicios/GuardarUsuario";
import { verificarNombreUsuarioExistente } from "../../Services/UsuarioServicios/VerificarNombreUsuarioExistente";
import ModalCargando from "../../components/Modal/ModalCargando";

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
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Arreglar Jere el value .length<20 xd, cambiar si sera aparte de @gmail.com
    if (value === "" || value.length < 20) {
      setEmailError("");
    } else if (!value.includes("@gmail.com")) {
      setEmailError("El correo es inválido");
    } else {
      setEmailError("");
    }
  };

  const handleEmailBlur = () => {
    if (email !== "" && !email.includes("@gmail.com")) {
      setEmailError("El correo es inválido");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    let error = "";
    if (!/[0-9]/.test(value)) {
      error = "La contraseña debe contener al menos un número.";
    } else if (!/[A-Z]/.test(value)) {
      error = "La contraseña debe contener al menos una letra mayúscula.";
    } else if (!/[a-z]/.test(value)) {
      error = "La contraseña debe contener al menos una letra minúscula.";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      error = "La contraseña debe contener al menos un carácter especial.";
    }
    setPasswordError(error);
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleUserNameChange = async (e) => {
    let value = e.target.value;

    // Elimina los espacios finales en tiempo real
    value = value.trimEnd();

    setUser(value);

    if (user.length > 20) {
      setUserError("El nombre de usuario no puede tener más de 20 caracteres.");
      return;
    }

    // Verificación en tiempo real
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
        navigate("/IniciarSesion"); // Navegación inmediata
        await guardarUsuarioPromise; // Espera solo si es esencial
      } else if (response.error) {
        alert(response.error); //Reemplazar con un modal
      }
    } catch (error) {
      console.error("Error al procesar el formulario:", error);
    } finally {
      setIsLoading(false);
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
                  required
                />

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
                  <input type="checkbox" required />
                  <label className="terms-label1">
                    He leído y acepto los{" "}
                    <a href="/terms">Términos y Condiciones</a>
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
        message="Cargando, por favor espera...\n "
        iconClass="fa fa-spinner fa-spin"
      />
    </>
  );
};

export default CrearCuenta;
