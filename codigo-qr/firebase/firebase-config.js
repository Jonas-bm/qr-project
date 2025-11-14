// Configuración de Firebase
// IMPORTANTE: Reemplaza estos valores con los de tu proyecto Firebase

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB80yRm2BGwpJqgFxOl6gi61mribP29sos",
  authDomain: "project-qr-e6275.firebaseapp.com",
  projectId: "project-qr-e6275",
  storageBucket: "project-qr-e6275.firebasestorage.app",
  messagingSenderId: "674489015838",
  appId: "1:674489015838:web:dd4b8c3df21ffd1660980f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// INSTRUCCIONES PARA OBTENER TU CONFIGURACIÓN:
// 
// 1. Ve a https://console.firebase.google.com/
// 2. Crea un nuevo proyecto o selecciona uno existente
// 3. Ve a "Configuración del proyecto" (ícono de engranaje)
// 4. En la sección "Tus apps", agrega una app web (</> ícono)
// 5. Copia los valores de firebaseConfig y pégalos arriba
//
// CONFIGURACIÓN NECESARIA EN FIREBASE CONSOLE:
//
// 1. AUTHENTICATION:
//    - Ve a Authentication > Sign-in method
//    - Habilita "Email/Password"
//    - Crea un usuario admin desde la pestaña "Users"
//
// 2. FIRESTORE DATABASE:
//    - Ve a Firestore Database > Crear base de datos
//    - Inicia en modo de prueba o con estas reglas:
//
//    rules_version = '2';
//    service cloud.firestore {
//      match /databases/{database}/documents {
//        // Permitir lectura pública de personas (para página QR)
//        match /personas/{personId} {
//          allow read: if true;
//          allow write: if request.auth != null;
//        }
//      }
//    }
//
// 3. STORAGE:
//    - Ve a Storage > Comenzar
//    - Usa estas reglas para permitir subida de fotos:
//
//    rules_version = '2';
//    service firebase.storage {
//      match /b/{bucket}/o {
//        match /personas/{personId}/{allPaths=**} {
//          allow read: if true;
//          allow write: if request.auth != null;
//        }
//      }
//    }
//
// 4. HOSTING (Opcional - para desplegar):
//    - Instala Firebase CLI: npm install -g firebase-tools
//    - En la carpeta del proyecto: firebase login
//    - firebase init hosting
//    - Selecciona tu proyecto
//    - Public directory: . (punto)
//    - Configure as single-page app: No
//    - firebase deploy
