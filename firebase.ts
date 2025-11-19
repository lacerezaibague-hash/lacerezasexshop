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
  apiKey: "AIzaSyD8zLRAnwZ4M6OAg-G2LOwJqLUQYOWD1qI", // Esta es la API Key proporcionada. Asegúrate de que sea correcta.
  authDomain: "la-cereza-ibague.firebaseapp.com",
  projectId: "la-cereza-ibague", // !!! CRÍTICO para Firestore. ¡NO LO OLVIDES! !!!
  storageBucket: "la-cereza-ibague.firebasestorage.app",
  messagingSenderId: "1089974027435",
  appId: "1:1089974027435:web:5127ae5ca6763614c8a3ee"
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
