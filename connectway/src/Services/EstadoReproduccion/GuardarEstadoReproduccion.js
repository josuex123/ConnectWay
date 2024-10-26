import { getFirestore, addDoc, collection,doc} from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const db = getFirestore(app);
//Cuando creamos por primera vez solo llenamos los campos de los id's lo demas vacio por que es la 1ra vez que se escucha
export const guardarEstadoReproduccion= async (idUsuario, IdAudiolibro) => {
    try {
        const estadoCollectionRef = collection(db, 'Usuario_EstadoReproduccion')
        const estadoDoc = await addDoc(estadoCollectionRef,{
            idUsuario: idUsuario,
            IdAudiolibro : IdAudiolibro,
            estadoReproduccion : 0,
            urlAudiolibro: '',
            
        });
        return estadoDoc.id;
    } catch (error) {
        console.log("Error al guardar el primer estado e reproducccion"+error)
        
    }


}