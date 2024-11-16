// GoogleSignInButton.js
import React, { useState } from "react";
import registrarUsuarioGoogle from "./RegistrarUsuarioGoogle"; // Asegúrate de la ruta correcta

const GoogleSignInButton = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      const userData = await registrarUsuarioGoogle();
      setUserInfo(userData); // Guarda los datos del usuario si el registro es exitoso
      setError(null); // Resetea cualquier error previo
      console.log("Usuario registrado con Google:", userData);
    } catch (error) {
      setUserInfo(null); // Resetea la información del usuario en caso de error
      setError("Error durante el registro con Google. Inténtalo nuevamente.");
    }
  };

  return (
    <div>
      <button onClick={handleGoogleSignIn}>Registrarse/Iniciar sesión con Google</button>
      {userInfo && (
        <div>
          <h3>Usuario Registrado:</h3>
          <p>Nombre: {userInfo.fullName}</p>
          <p>Email: {userInfo.email}</p>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GoogleSignInButton;
