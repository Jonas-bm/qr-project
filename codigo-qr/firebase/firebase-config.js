// Configuración de Firebase para tu proyecto
// IMPORTANTE: Esta configuración usa Firebase SDK v9 en modo COMPAT
// Compatible con la sintaxis usada en los archivos HTML

const firebaseConfig = {
  apiKey: "AIzaSyCqvk0yMzddVyEIvvKIBeCruZjR7vlNVBs",
  authDomain: "cientec-f1860.firebaseapp.com",
  projectId: "cientec-f1860",
  storageBucket: "cientec-f1860.firebasestorage.app",
  messagingSenderId: "1085589065738",
  appId: "1:1085589065738:web:9355665058e6aa20430ff3"
};

// Inicializar Firebase (modo compat)
firebase.initializeApp(firebaseConfig);

// Exportar referencias para uso en otros archivos (opcional)
// const db = firebase.firestore();
// const storage = firebase.storage();
// const auth = firebase.auth();