import React,{useState} from 'react';
import './CrearCuenta.css';
import { useNavigate } from 'react-router-dom';
import registrarUsuario from '../../Services/UsuarioServicios/RegistrarUsuarioCorreoContraseña';
import { guardarUsuario } from '../../Services/UsuarioServicios/GuardarUsuario';
import { verificarNombreUsuarioExistente } from '../../Services/UsuarioServicios/VerificarNombreUsuarioExistente';

const CrearCuenta = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [user, setUser] = useState('');
    const [userError, setUserError] = useState(''); // Estado para el error del usuario
    const [loading, setLoading] = useState(false);
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

  const handleUserNameChange = async (e) => {
    let value = e.target.value;
  
    // Elimina los espacios finales en tiempo real
    value = value.trimEnd();
  
    setUser(value);
  
    // Verificación en tiempo real
    if (value.trim() !== '') {
      const usuarioExistente = await verificarNombreUsuarioExistente(value);
      if (usuarioExistente) {
        setUserError('El nombre de usuario ya existe. Intenta con otro.');
      } else {
        setUserError('');
      }
    } else {
      setUserError('');
    }
  };
  

  const validateForm = () => {
    let valid = true;
  
    if (!email || emailError) valid = false;
    if (!password || passwordError) valid = false;
  
    if (password !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden.');
      valid = false;
    } else {
      setConfirmPasswordError('');
    }
  
    return valid;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      console.log('Por favor, corrige los errores antes de enviar.');
      return;
    }
  
    if (userError!='') {
      alert('Por favor, corrige los errores en el campo "Usuario" antes de enviar.');
      return;
    }
  

    setLoading(true); // modal de carga o algo
    try {
      const response = await registrarUsuario(email, password);
  
      if (response.email) {
        const guardarUsuarioPromise = guardarUsuario(response.email, user);
        navigate('/Home/0'); // Navegación inmediata
        await guardarUsuarioPromise; // Espera solo si es esencial
      } else if (response.error) {
        alert(response.error);//Reemplazar con un modal
      }
    } catch (error) {
      console.error('Error al procesar el formulario:', error);
    } finally {
      setLoading(false);
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
          <input 
            type="text" 
            placeholder="Ingrese un usuario" 
            value={user}
            onChange={handleUserNameChange}
            required
          />
          {userError && <p className="error-message">{userError}</p>}

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

          <button type="submit" className="register-button">
            Registrarse
          </button>
        </form>
        <div className='crear-of-ini'>
            <p>¿Ya tienes una cuenta? <a href="/IniciarSesion" className="create-login1">Iniciar Sesión</a></p>
        </div>
      </div>
    </div>
  );
};

export default CrearCuenta;
