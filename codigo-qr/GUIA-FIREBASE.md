# 🔥 GUÍA COMPLETA DE CONFIGURACIÓN FIREBASE

## 📋 TABLA DE CONTENIDOS
1. [Crear Proyecto Firebase](#1-crear-proyecto-firebase)
2. [Obtener Configuración](#2-obtener-configuración-del-proyecto)
3. [Configurar Authentication](#3-configurar-authentication)
4. [Configurar Firestore Database](#4-configurar-firestore-database)
5. [Configurar Storage](#5-configurar-storage)
6. [Actualizar Código](#6-actualizar-tu-código)
7. [Probar Conexión](#7-probar-la-conexión)

---

## 1️⃣ CREAR PROYECTO FIREBASE

### Paso 1: Acceder a Firebase Console
1. Ve a: **https://console.firebase.google.com/**
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Agregar proyecto"** o **"Crear un proyecto"**

### Paso 2: Configurar el Proyecto
1. **Nombre del proyecto:** `sistema-qr-cientec` (o el nombre que prefieras)
2. Haz clic en **Continuar**
3. **Google Analytics:** 
   - Puedes desactivarlo para empezar más rápido
   - O activarlo y seleccionar una cuenta
4. Haz clic en **Crear proyecto**
5. Espera 30-60 segundos mientras se crea
6. Haz clic en **Continuar**

---

## 2️⃣ OBTENER CONFIGURACIÓN DEL PROYECTO

### Paso 1: Registrar una App Web
1. En la página principal de tu proyecto, busca el texto **"Comienza agregando Firebase a tu aplicación"**
2. Haz clic en el ícono **Web** (símbolo `</>`)
3. **Apodo de la app:** `Sistema QR Web`
4. **NO** marques "Configurar Firebase Hosting" por ahora
5. Haz clic en **Registrar app**

### Paso 2: Copiar la Configuración
Verás un código similar a este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "tu-proyecto-12345.firebaseapp.com",
  projectId: "tu-proyecto-12345",
  storageBucket: "tu-proyecto-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### Paso 3: Copiar SOLO los Valores
**IMPORTANTE:** Copia SOLO los valores entre comillas, ejemplo:
- ✅ `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
- ❌ `apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",`

Haz clic en **Continuar a la consola**

---

## 3️⃣ CONFIGURAR AUTHENTICATION

### Paso 1: Habilitar Authentication
1. En el menú lateral izquierdo, haz clic en **"Compilación"** o **"Build"**
2. Haz clic en **"Authentication"**
3. Haz clic en el botón **"Comenzar"** o **"Get Started"**

### Paso 2: Habilitar Email/Password
1. Ve a la pestaña **"Sign-in method"** (Método de acceso)
2. En la lista de proveedores, busca **"Correo electrónico/contraseña"**
3. Haz clic en él
4. **Activa** el interruptor de **"Habilitar"**
5. NO actives "Vínculo de correo electrónico (acceso sin contraseña)"
6. Haz clic en **"Guardar"**

### Paso 3: Crear Usuario Administrador
1. Ve a la pestaña **"Users"** (Usuarios)
2. Haz clic en **"Agregar usuario"**
3. **Email:** `admin@cientec.com` (o el que prefieras)
4. **Contraseña:** Crea una contraseña segura (mínimo 6 caracteres)
   - Ejemplo: `Admin123!`
   - **¡ANOTA ESTA CONTRASEÑA!**
5. Haz clic en **"Agregar usuario"**

✅ **Listo!** Ahora tienes un usuario admin creado.

---

## 4️⃣ CONFIGURAR FIRESTORE DATABASE

### Paso 1: Crear Base de Datos
1. En el menú lateral, en **"Compilación"**, haz clic en **"Firestore Database"**
2. Haz clic en **"Crear base de datos"**

### Paso 2: Seleccionar Ubicación
1. **Ubicación:** Selecciona la más cercana a tu país
   - Para México/Centroamérica: `us-central` o `nam5 (United States)`
   - Para Sudamérica: `southamerica-east1 (São Paulo)`
   - Para Europa: `europe-west1`
2. Haz clic en **"Siguiente"**

### Paso 3: Configurar Reglas de Seguridad
1. Selecciona **"Comenzar en modo de producción"**
2. Haz clic en **"Crear"**
3. Espera 1-2 minutos mientras se crea

### Paso 4: Configurar Reglas Personalizadas
1. Una vez creada, ve a la pestaña **"Reglas"** (Rules)
2. **BORRA TODO** el contenido actual
3. **PEGA** este código:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Colección de personas
    match /personas/{personId} {
      // Permitir lectura pública (para QR)
      allow read: if true;
      
      // Permitir escritura solo a usuarios autenticados (admin)
      allow create, update, delete: if request.auth != null;
    }
  }
}
```

4. Haz clic en **"Publicar"**

✅ **Explicación de las reglas:**
- `allow read: if true` → Cualquiera puede leer (necesario para los QR públicos)
- `allow create, update, delete: if request.auth != null` → Solo usuarios autenticados pueden modificar

---

## 5️⃣ CONFIGURAR STORAGE

### Paso 1: Activar Storage
1. En el menú lateral, en **"Compilación"**, haz clic en **"Storage"**
2. Haz clic en **"Comenzar"** o **"Get Started"**

### Paso 2: Configurar Reglas
1. Lee las reglas predeterminadas
2. Haz clic en **"Siguiente"**

### Paso 3: Seleccionar Ubicación
1. Usa la **MISMA ubicación** que elegiste para Firestore
2. Haz clic en **"Listo"**

### Paso 4: Actualizar Reglas de Seguridad
1. Ve a la pestaña **"Rules"** (Reglas)
2. **BORRA TODO** el contenido
3. **PEGA** este código:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Carpeta de fotos de personas
    match /personas/{personId}/{fileName} {
      // Permitir lectura pública
      allow read: if true;
      
      // Permitir subida solo a usuarios autenticados
      allow write: if request.auth != null 
                   && request.resource.size < 5 * 1024 * 1024  // Máximo 5MB
                   && request.resource.contentType.matches('image/.*');  // Solo imágenes
    }
  }
}
```

4. Haz clic en **"Publicar"**

✅ **Explicación de las reglas:**
- Permite lectura pública de fotos
- Solo admins pueden subir
- Máximo 5MB por foto
- Solo acepta imágenes

---

## 6️⃣ ACTUALIZAR TU CÓDIGO

### Paso 1: Abrir firebase-config.js
Abre el archivo: `firebase/firebase-config.js`

### Paso 2: Reemplazar la Configuración
Encontrarás esto:

```javascript
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROJECT_ID.firebaseapp.com",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_PROJECT_ID.appspot.com",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};
```

**REEMPLAZA** con los valores que copiaste en el **Paso 2**, ejemplo:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyC1X2Y3Z4A5B6C7D8E9F0G1H2I3J4K5L6M",
    authDomain: "sistema-qr-cientec.firebaseapp.com",
    projectId: "sistema-qr-cientec",
    storageBucket: "sistema-qr-cientec.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abc123def456ghi789"
};
```

### Paso 3: Guardar el Archivo
Presiona **Ctrl + S** para guardar

---

## 7️⃣ PROBAR LA CONEXIÓN

### Opción A: Con Python (Recomendado)
```powershell
# En la carpeta del proyecto
cd "d:\MY\DESARROLLO\CIENTEC\codigo-qr"

# Iniciar servidor
python -m http.server 8000
```

### Opción B: Con Live Server (VS Code)
1. Instala extensión "Live Server"
2. Clic derecho en `index.html`
3. "Open with Live Server"

### Opción C: Con Node.js
```powershell
npx http-server -p 8000
```

### Probar el Sistema
1. Abre: **http://localhost:8000**
2. Haz clic en **ADMINISTRADOR**
3. Ingresa:
   - Email: `admin@cientec.com` (el que creaste)
   - Contraseña: (la que creaste)
4. Haz clic en **Iniciar Sesión**

✅ **Si todo está bien:**
- Te redirigirá a `admin.html`
- Podrás ver el panel de administración

❌ **Si hay error:**
- Revisa la consola del navegador (F12)
- Verifica que copiaste bien la configuración
- Verifica que el usuario existe en Authentication

---

## 🔍 VERIFICAR CONFIGURACIÓN

### Ver tu Configuración en Firebase Console
1. Ve a **Configuración del proyecto** (ícono de engranaje ⚙️)
2. Desplázate hasta **"Tus apps"**
3. Verás tu app web con el nombre que le pusiste
4. Ahí puedes copiar de nuevo la configuración si la necesitas

### Ver Usuarios Creados
1. **Authentication** → **Users**
2. Deberías ver tu usuario admin listado

### Ver Reglas de Firestore
1. **Firestore Database** → **Rules**
2. Deberías ver las reglas que pegaste

### Ver Reglas de Storage
1. **Storage** → **Rules**
2. Deberías ver las reglas que pegaste

---

## 📝 CHECKLIST FINAL

Antes de usar el sistema, verifica:

- [ ] ✅ Proyecto Firebase creado
- [ ] ✅ App Web registrada
- [ ] ✅ Configuración copiada a `firebase-config.js`
- [ ] ✅ Authentication habilitado (Email/Password)
- [ ] ✅ Usuario admin creado
- [ ] ✅ Firestore Database creado
- [ ] ✅ Reglas de Firestore publicadas
- [ ] ✅ Storage habilitado
- [ ] ✅ Reglas de Storage publicadas
- [ ] ✅ Servidor local corriendo
- [ ] ✅ Puedes hacer login

---

## 🚨 PROBLEMAS COMUNES

### Error: "Firebase is not defined"
**Solución:** Revisa que `firebase-config.js` tenga la configuración correcta.

### Error: "auth/invalid-credential"
**Solución:** 
- Verifica el email y contraseña
- Asegúrate de que el usuario existe en Authentication

### Error: "Missing or insufficient permissions"
**Solución:** 
- Verifica las reglas de Firestore
- Asegúrate de haber hecho login antes de modificar datos

### No se suben las fotos
**Solución:**
- Verifica las reglas de Storage
- Asegúrate de que la foto sea menor a 5MB
- Solo se aceptan imágenes (jpg, png, gif, etc.)

---

## 📞 SOPORTE

Si tienes problemas:
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Busca errores en rojo
4. Copia el mensaje de error y búscalo en Google

**Documentación oficial:**
- Firebase: https://firebase.google.com/docs
- Firestore: https://firebase.google.com/docs/firestore
- Storage: https://firebase.google.com/docs/storage
- Authentication: https://firebase.google.com/docs/auth

---

## ✅ ¡LISTO!

Si completaste todos los pasos, tu sistema está **100% configurado y listo para usar**.

Puedes empezar a:
- Registrar personas
- Generar códigos QR
- Escanear QRs y ver información

---

**Última actualización:** 13 de noviembre de 2025
**Versión de Firebase SDK:** 9.22.0
