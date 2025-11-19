import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

// ====================================================================================
// TODO: ACCIÓN REQUERIDA
// ¡IMPORTANTE! Reemplaza *TODO* este objeto de configuración con los valores de TU PROPIO
// proyecto de Firebase. Es CRÍTICO que al menos 'projectId' esté configurado correctamente
// para que Firestore funcione. Si dejas los valores 'YOUR_...', la aplicación NO funcionará
// correctamente con tu base de datos.
//
// ¿CÓMO OBTENER TU CONFIGURACIÓN DE FIREBASE?:
// 1. Ve a la consola de tu proyecto en Firebase (https://console.firebase.google.com/).
// 2. Ve a "Configuración del proyecto" (el ícono de engranaje ⚙️) en la barra lateral izquierda.
// 3. En la pestaña "General", desplázate hacia abajo hasta la sección "Tus apps".
// 4. Si aún no tienes una, haz clic en el ícono web (</>) para "Añadir app a tu sitio"
//    y sigue los pasos. Si ya tienes una, haz clic en ella.
// 5. Busca el objeto `firebaseConfig` que se te proporciona y copia y pega *todos* sus
//    valores (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId) aquí.
//    Asegúrate de que no queden placeholders como 'YOUR_AUTH_DOMAIN', 'YOUR_PROJECT_ID', etc.
// ====================================================================================
const firebaseConfig = {
  apiKey: "AIzaSyBl7Nr9mzfHn_TiMB6O6K_vULTu4DZhkBY", // Esta es la API Key proporcionada. Asegúrate de que sea correcta.
  authDomain: "lacerezaibague-8f1fa.firebaseapp.com",
  projectId: "lacerezaibague-8f1fa", // !!! CRÍTICO para Firestore. ¡NO LO OLVIDES! !!!
  storageBucket: "lacerezaibague-8f1fa.firebasestorage.app",
  messagingSenderId: "578034195828",
  appId: "1:578034195828:web:8c0de285e0cbf581686021"
};

// Initialize Firebase App
const app: FirebaseApp = initializeApp(firebaseConfig);

let dbInstance: Firestore;

// Export a function to get the database instance (singleton).
// This ensures Firestore is initialized only when first needed,
// resolving race conditions where the service might not be available yet.
export const getDb = (): Firestore => {
  if (!dbInstance) {
    dbInstance = getFirestore(app);
  }
  return dbInstance;
};