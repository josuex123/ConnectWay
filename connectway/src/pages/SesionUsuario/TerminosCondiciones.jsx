import React from 'react';

const TermsAndConditions = () => {
  const styles = {
    container: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '30px 20px',
      fontFamily: 'Arial, sans-serif',
      color: '#03314B', // Cambiado a color solicitado
      backgroundColor: '#ffffff', // Fondo blanco
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px', // Espaciado entre el logo y el título
      justifyContent: 'flex-start', // Alinea el logo a la izquierda
      marginLeft: '-25px',
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      textAlign: 'left', // Alineación a la izquierda
      color: '#03314B', // Cambiado a color solicitado
      marginBottom: '20px',
    },

    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginTop: '20px',
      marginBottom: '10px',
      color: '#03314B', // Cambiado a color solicitado
    },
    text: {
      fontSize: '1rem',
      lineHeight: '1.8',
      marginBottom: '15px',
    },
    separator: {
        borderBottom: '1px solid #03314B', // Línea separadora
        marginBottom: '20px',
      },
    list: {
      paddingLeft: '20px',
      marginBottom: '15px',
    },
    listItem: {
      fontSize: '1rem',
      lineHeight: '1.8',
      marginBottom: '8px',
    },
    link: {
      color: '#2980b9',
      textDecoration: 'none',
    },
    footer: {
      textAlign: 'center',
      marginTop: '30px',
      fontSize: '1rem',
      color: '#03314B', // Cambiado a color solicitado
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.logoContainer}>
        <a aria-current="page" className="nav-logo active" href="/">
          <img
            src="/static/media/logoejemplo1.c980e2af407abe9383a3.jpeg"
            alt="Logo"
            className="nav-logo-image"
            style={{ marginRight: '10px' }} // Asegura que haya espacio entre el logo y el texto
          />
          <span className="nav-logo-text connect">Connect</span>
          <span className="nav-logo-text way">Way</span>
        </a>
      </div>
      <h1 style={styles.title}>Términos y Condiciones</h1>
     

      <p style={styles.text}>
        Bienvenido/a a ConnectWay. Estos términos y condiciones regulan el uso de nuestra
        plataforma, que ofrece audiolibros especializados en inteligencia emocional, meditación,
        psicología de parejas y salud mental. Al acceder y utilizar nuestros servicios, aceptas
        cumplir con estos términos.
      </p>
      <div style={styles.separator}></div>
      <h2 style={styles.sectionTitle}>1. Uso de la Plataforma</h2>
      <p style={styles.text}>
        ConnectWay está diseñada para proporcionar acceso a contenido de calidad en el ámbito de la
        salud mental y el desarrollo personal. Al usar nuestra plataforma:
      </p>
      <ul style={styles.list}>
        <li style={styles.listItem}>No debes usar nuestros servicios para fines ilícitos o no autorizados.</li>
        <li style={styles.listItem}>Te comprometes a proporcionar información veraz y actualizada al registrarte.</li>
        <li style={styles.listItem}>
          Respetarás los derechos de autor y la propiedad intelectual de nuestros contenidos.
        </li>
      </ul>

      <h2 style={styles.sectionTitle}>2. Cuentas de Usuario</h2>
      <p style={styles.text}>
        Puedes crear una cuenta en ConnectWay mediante email y contraseña, o utilizar tu cuenta de
        Google. Es tu responsabilidad mantener la confidencialidad de tus credenciales de inicio de
        sesión y notificar de inmediato cualquier uso no autorizado de tu cuenta.
      </p>

      <h2 style={styles.sectionTitle}>3. Derechos de Propiedad Intelectual</h2>
      <p style={styles.text}>
        Todos los audiolibros y contenidos disponibles en ConnectWay son propiedad de sus
        respectivos creadores y están protegidos por las leyes de derechos de autor. No está
        permitido copiar, distribuir, modificar o utilizar los contenidos sin autorización expresa.
      </p>

      <h2 style={styles.sectionTitle}>4. Privacidad</h2>
      <p style={styles.text}>
        En ConnectWay nos tomamos en serio tu privacidad. Recopilamos y almacenamos datos
        personales necesarios para el funcionamiento de la plataforma. Para más detalles, consulta
        nuestra{' '}
        <a href="/privacy-policy" style={styles.link}>
          Política de Privacidad
        </a>
        .
      </p>

      <h2 style={styles.sectionTitle}>5. Limitaciones de Responsabilidad</h2>
      <p style={styles.text}>
        ConnectWay no se hace responsable de:
      </p>
      <ul style={styles.list}>
        <li style={styles.listItem}>Errores en los contenidos proporcionados por terceros.</li>
        <li style={styles.listItem}>Interrupciones del servicio por mantenimiento o problemas técnicos.</li>
        <li style={styles.listItem}>Daños derivados del uso incorrecto de la plataforma.</li>
      </ul>

      <h2 style={styles.sectionTitle}>6. Cambios en los Términos</h2>
      <p style={styles.text}>
        Nos reservamos el derecho de modificar estos términos en cualquier momento. Notificaremos
        cualquier cambio mediante un aviso en la plataforma. Es tu responsabilidad revisar los
        términos periódicamente.
      </p>

      <h2 style={styles.sectionTitle}>7. Cancelación de Cuentas</h2>
      <p style={styles.text}>
        Puedes cancelar tu cuenta en cualquier momento. Nos reservamos el derecho de suspender o
        cancelar cuentas que infrinjan estos términos.
      </p>

      <h2 style={styles.sectionTitle}>8. Contacto</h2>
      <p style={styles.text}>
        Si tienes preguntas sobre estos Términos y Condiciones, puedes contactarnos en{' '}
        <a href="mailto:abejasnet9@gmail.com" style={styles.link}>
        abejasnet9@gmail.com
        </a>
        .
      </p>

      <p style={styles.footer}>
        <strong>Al utilizar ConnectWay, aceptas estos Términos y Condiciones en su totalidad.</strong>
      </p>
    </div>
  );
};

export default TermsAndConditions;
