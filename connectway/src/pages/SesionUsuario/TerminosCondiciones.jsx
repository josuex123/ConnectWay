import React from 'react';
import '../../estilos/SesionUsuario/TerminosCondiciones.css';

const TermsAndConditionsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content1 terms-modal">
        <div className="modal-header">
          <h2 className="title-modal">Términos y Condiciones</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-divider" />
        <div className="modal-body terms-body">
          <p className="terms-text">
            Bienvenido/a a ConnectWay. Estos términos y condiciones regulan el uso de nuestra
            plataforma, que ofrece audiolibros especializados en inteligencia emocional, meditación,
            psicología de parejas y salud mental. Al acceder y utilizar nuestros servicios, aceptas
            cumplir con estos términos.
          </p>
          <div className="terms-separator"></div>

          <h2 className="terms-section-title">1. Uso de la Plataforma</h2>
          <p className="terms-text">
            ConnectWay está diseñada para proporcionar acceso a contenido de calidad en el ámbito de
            la salud mental y el desarrollo personal. Al usar nuestra plataforma:
          </p>
          <ul className="terms-list">
            <li className="terms-list-item">
              No debes usar nuestros servicios para fines ilícitos o no autorizados.
            </li>
            <li className="terms-list-item">
              Te comprometes a proporcionar información veraz y actualizada al registrarte.
            </li>
            <li className="terms-list-item">
              Respetarás los derechos de autor y la propiedad intelectual de nuestros contenidos.
            </li>
          </ul>

          <h2 className="terms-section-title">2. Cuentas de Usuario</h2>
          <p className="terms-text">
            Puedes crear una cuenta en ConnectWay mediante email y contraseña, o utilizar tu cuenta
            de Google. Es tu responsabilidad mantener la confidencialidad de tus credenciales de
            inicio de sesión y notificar de inmediato cualquier uso no autorizado de tu cuenta.
          </p>

          <h2 className="terms-section-title">3. Derechos de Propiedad Intelectual</h2>
          <p className="terms-text">
            Todos los audiolibros y contenidos disponibles en ConnectWay son propiedad de sus
            respectivos creadores y están protegidos por las leyes de derechos de autor. No está
            permitido copiar, distribuir, modificar o utilizar los contenidos sin autorización
            expresa.
          </p>

          <h2 className="terms-section-title">4. Privacidad</h2>
          <p className="terms-text">
            En ConnectWay nos tomamos en serio tu privacidad. Recopilamos y almacenamos datos
            personales necesarios para el funcionamiento de la plataforma. Para más detalles,
            consulta nuestra{' '}
            <a href="/privacy-policy" className="terms-link">
              Política de Privacidad
            </a>
            .
          </p>

          <h2 className="terms-section-title">5. Limitaciones de Responsabilidad</h2>
          <p className="terms-text">
            ConnectWay no se hace responsable de:
          </p>
          <ul className="terms-list">
            <li className="terms-list-item">
              Errores en los contenidos proporcionados por terceros.
            </li>
            <li className="terms-list-item">
              Interrupciones del servicio por mantenimiento o problemas técnicos.
            </li>
            <li className="terms-list-item">
              Daños derivados del uso incorrecto de la plataforma.
            </li>
          </ul>

          <h2 className="terms-section-title">6. Cambios en los Términos</h2>
          <p className="terms-text">
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Notificaremos
            cualquier cambio mediante un aviso en la plataforma. Es tu responsabilidad revisar los
            términos periódicamente.
          </p>

          <h2 className="terms-section-title">7. Cancelación de Cuentas</h2>
          <p className="terms-text">
            Puedes cancelar tu cuenta en cualquier momento. Nos reservamos el derecho de suspender o
            cancelar cuentas que infrinjan estos términos.
          </p>

          <h2 className="terms-section-title">8. Contacto</h2>
          <p className="terms-text">
            Si tienes preguntas sobre estos Términos y Condiciones, puedes contactarnos en{' '}
            <a href="mailto:abejasnet9@gmail.com" className="terms-link">
              abejasnet9@gmail.com
            </a>
            .
          </p>

          <p className="terms-footer">
            <strong>
              Al utilizar ConnectWay, aceptas estos Términos y Condiciones en su totalidad.
            </strong>
          </p>
        </div>
        <div className="modal-footer-noti">
          <button className="confirm-button" onClick={onClose}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsModal;
