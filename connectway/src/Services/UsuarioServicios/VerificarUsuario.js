// authService.js
import { auth, } from '../../firebaseConfig';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const db = getFirestore(); 
const googleProvider = new GoogleAuthProvider(); 

const VerificarUsuario = {

  signInWithGoogle: () => {
    return signInWithPopup(auth, googleProvider)
      .then((result) => {
        console.log('Usuario autenticado con Google:', result.user);
        return result.user;
      })
      .catch((error) => {
        console.error('Error al iniciar sesión con Google:', error.message);
        throw error;
      });
  },

  getEmailFromUsername: async (username) => {
    const userDocRef = doc(db, 'Usuario', username); 
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.id;
    } else {
      throw new Error('Usuario no encontrado');
    }
  },

 
  signInWithEmail: async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Usuario autenticado con correo y contraseña:', userCredential.user);
        return userCredential.user;
      })
      .catch((error) => {
        console.error('Error al iniciar sesión con correo y contraseña:', error.message);
        throw error;
      });
  }

};

export default VerificarUsuario;
