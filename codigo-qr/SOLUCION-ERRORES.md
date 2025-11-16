# 🚨 SOLUCIÓN DE ERRORES DE FIREBASE

## ✅ CORRECCIONES APLICADAS

Se han corregido los siguientes problemas:

### 1. ❌ Sintaxis incompatible en firebase-config.js
**ANTES:** Usaba `import/export` (ES6 modules)
**AHORA:** Usa sintaxis compat (compatible con los HTML)

### 2. ❌ firebase.json con directorio incorrecto
**ANTES:** `"public": "y"`
**AHORA:** `"public": "."`

### 3. ❌ .firebaserc con proyecto incorrecto
**ANTES:** Referencia a `qr-project-35698`
**AHORA:** Referencia correcta a `cientec-f1860`

---

## 🧪 PROBAR LA CONEXIÓN

### Paso 1: Abrir archivo de prueba
```powershell
# En PowerShell, ejecuta:
cd "d:\MY\DESARROLLO\CIENTEC\codigo-qr"
python -m http.server 8000
```

### Paso 2: Abrir en navegador
```
http://localhost:8000/test-firebase.html
```

### Paso 3: Verificar resultados
- ✅ **Verde** = Todo funciona bien
- ❌ **Rojo** = Hay que configurar ese servicio en Firebase
- ⚠️ **Amarillo** = Advertencia

---

## 🔥 ERRORES COMUNES Y SOLUCIONES

### Error 1: "Firebase is not defined"
**Causa:** Los scripts de Firebase no se cargan correctamente

**Solución:**
1. Verifica tu conexión a internet
2. Abre la consola (F12) y revisa errores
3. Asegúrate de que `firebase-config.js` se carga DESPUÉS de los SDK

---

### Error 2: "Firebase App not initialized"
**Causa:** La configuración no está correcta

**Solución:**
```javascript
// Verifica que firebase-config.js contenga:
const firebaseConfig = {
  apiKey: "AIzaSyCqvk0yMzddVyEIvvKIBeCruZjR7vlNVBs",
  authDomain: "cientec-f1860.firebaseapp.com",
  projectId: "cientec-f1860",
  storageBucket: "cientec-f1860.firebasestorage.app",
  messagingSenderId: "1085589065738",
  appId: "1:1085589065738:web:9355665058e6aa20430ff3"
};

firebase.initializeApp(firebaseConfig);
```

---

### Error 3: "Missing or insufficient permissions" (Firestore)
**Causa:** Las reglas de Firestore no están configuradas

**Solución:**
1. Ve a Firebase Console → Firestore Database
2. Clic en pestaña "Reglas"
3. Pega este código:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /personas/{personId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }
  }
}
```

4. Clic en "Publicar"

---

### Error 4: "Storage object 'xyz' does not exist"
**Causa:** Storage no está habilitado o las reglas bloquean

**Solución:**
1. Ve a Firebase Console → Storage
2. Si no está habilitado, haz clic en "Comenzar"
3. Ve a pestaña "Reglas"
4. Pega este código:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /personas/{personId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

5. Clic en "Publicar"

---

### Error 5: "auth/invalid-credential"
**Causa:** No hay usuarios creados en Authentication

**Solución:**
1. Ve a Firebase Console → Authentication
2. Asegúrate de que "Email/Password" esté habilitado
3. Ve a pestaña "Users"
4. Clic en "Add user"
5. Email: admin@cientec.com
6. Password: (tu contraseña segura)
7. Clic en "Add user"

---

### Error 6: CORS errors en local
**Causa:** Navegador bloquea peticiones locales

**Solución:**
✅ **Usa un servidor local** (NO abras index.html directamente)

```powershell
# Python
python -m http.server 8000

# O Node.js
npx http-server -p 8000

# O PHP
php -S localhost:8000

# O VS Code Live Server
# Instala extensión "Live Server" y úsala
```

---

### Error 7: "Cannot read property 'auth' of undefined"
**Causa:** firebase-config.js se carga antes que los SDKs

**Solución:**
Verifica el orden en tus HTML:

```html
<!-- ✅ CORRECTO: SDKs primero -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-storage-compat.js"></script>
<!-- Config al final -->
<script src="firebase/firebase-config.js"></script>
```

---

## 🔍 VERIFICAR CONFIGURACIÓN EN FIREBASE CONSOLE

### 1. Verificar Proyecto
1. Ve a: https://console.firebase.google.com/
2. Asegúrate de estar en el proyecto: **cientec-f1860**

### 2. Verificar Services Habilitados

**Authentication:**
- ✅ Email/Password debe estar "Enabled"
- ✅ Debe haber al menos 1 usuario creado

**Firestore Database:**
- ✅ Debe estar creado (no vacío)
- ✅ Reglas deben permitir lectura pública

**Storage:**
- ✅ Debe estar habilitado
- ✅ Reglas deben permitir lectura pública

### 3. Verificar Reglas

**Firestore Rules (Cloud Firestore → Rules):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /personas/{personId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }
  }
}
```

**Storage Rules (Storage → Rules):**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /personas/{personId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 📋 CHECKLIST DE VERIFICACIÓN

Marca cada item cuando lo verifiques:

### En Firebase Console:
- [ ] Proyecto "cientec-f1860" seleccionado
- [ ] Authentication habilitado (Email/Password)
- [ ] Usuario admin creado
- [ ] Firestore Database creado
- [ ] Reglas de Firestore publicadas
- [ ] Storage habilitado
- [ ] Reglas de Storage publicadas

### En tu código:
- [ ] `firebase-config.js` tiene la configuración correcta
- [ ] Archivos HTML cargan SDKs en orden correcto
- [ ] Servidor local corriendo (NO abrir archivos directamente)
- [ ] test-firebase.html muestra tests en VERDE

---

## 🚀 PASOS PARA PROBAR

### 1. Test de Conexión
```
http://localhost:8000/test-firebase.html
```
Todos los tests deben estar en ✅ verde

### 2. Test de Login
```
http://localhost:8000/
```
- Clic en "ADMINISTRADOR"
- Ingresar credenciales
- Debe redirigir a admin.html

### 3. Test de CRUD
En admin.html:
- Crear una persona
- Debe guardarse en Firestore
- Generar QR
- Debe mostrarse el código

### 4. Test de QR Público
- Copia la URL del QR
- Pégala en el navegador
- Debe mostrar los datos de la persona

---

## 🆘 SI NADA FUNCIONA

### Opción 1: Revisar Consola del Navegador
1. Presiona F12
2. Ve a "Console"
3. Copia el error exacto
4. Búscalo en Google o pégalo aquí

### Opción 2: Verificar Red
1. F12 → Pestaña "Network"
2. Recarga la página
3. Busca peticiones en ROJO
4. Revisa el error

### Opción 3: Limpiar Caché
1. Ctrl + Shift + Delete
2. Selecciona "Cached images and files"
3. Clear data
4. Recarga la página (Ctrl + Shift + R)

---

## 📞 CONTACTO FIREBASE SUPPORT

Si el problema persiste:
- Stack Overflow: https://stackoverflow.com/questions/tagged/firebase
- Firebase Discord: https://discord.gg/firebase
- Documentación: https://firebase.google.com/docs

---

**Última actualización:** 14 de noviembre de 2025
