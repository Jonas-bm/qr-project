# 📱 Sistema de Gestión de Códigos QR

Sistema web completo desarrollado con **HTML, CSS, JavaScript y Firebase** para gestionar personas y generar códigos QR personalizados.

---

## 🎯 Características Principales

### 👨‍💼 Panel de Administración
- ✅ Login seguro con Firebase Authentication
- ✅ Registro de personas con datos completos
- ✅ Subida de fotos a Firebase Storage
- ✅ Generación automática de códigos QR
- ✅ Edición y eliminación de registros
- ✅ Tabla dinámica con todos los registros
- ✅ Descarga e impresión de códigos QR

### 📱 Página Pública (Escaneando QR)
- ✅ Visualización de información personal
- ✅ Diseño moderno y responsivo
- ✅ Acceso sin autenticación necesaria

---

## 🗂 Estructura del Proyecto

```
/codigo-qr
│
├── index.html              # Login del administrador
├── admin.html              # Panel de administración
├── persona.html            # Página pública individual
├── styles.css              # Estilos globales
├── admin.js                # Lógica del panel admin
├── persona.js              # Lógica de página pública
│
├── /firebase
│   └── firebase-config.js  # Configuración de Firebase
│
└── /lib
    └── qrcode.min.js       # Librería para generar QR
```

---

## 🚀 Configuración e Instalación

### 1️⃣ Configurar Firebase

#### A. Crear Proyecto Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Acepta los términos y configura Google Analytics (opcional)

#### B. Obtener Configuración
1. En el proyecto, ve a **Configuración del proyecto** (⚙️)
2. En "Tus apps", haz clic en el ícono web `</>`
3. Registra tu app con un nombre
4. Copia el objeto `firebaseConfig`
5. Pega los valores en `firebase/firebase-config.js`

**Ejemplo:**
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:xxxxxxxxxxxxx"
};
```

---

### 2️⃣ Configurar Authentication

1. En Firebase Console, ve a **Authentication**
2. Haz clic en **Comenzar**
3. En la pestaña **Sign-in method**, habilita **Email/Password**
4. Ve a la pestaña **Users**
5. Haz clic en **Agregar usuario**
6. Crea tu usuario admin:
   - Email: `admin@tudominio.com`
   - Contraseña: (elige una segura)

---

### 3️⃣ Configurar Firestore Database

1. En Firebase Console, ve a **Firestore Database**
2. Haz clic en **Crear base de datos**
3. Selecciona ubicación (elige la más cercana)
4. Inicia en **modo de prueba** (temporal) o con reglas personalizadas

#### Reglas de Firestore Recomendadas:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura pública de personas (para QR público)
    // Solo usuarios autenticados pueden escribir
    match /personas/{personId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

### 4️⃣ Configurar Storage

1. En Firebase Console, ve a **Storage**
2. Haz clic en **Comenzar**
3. Acepta las reglas por defecto y haz clic en **Listo**

#### Reglas de Storage Recomendadas:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /personas/{personId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

### 5️⃣ Instalar Librería QRCode.js

**OPCIÓN 1 - Desde CDN (Recomendado):**

En `admin.html`, cambia la línea:
```html
<script src="lib/qrcode.min.js"></script>
```

Por:
```html
<script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
```

**OPCIÓN 2 - Descarga Manual:**
1. Ve a: https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js
2. Guarda el archivo en la carpeta `/lib/` como `qrcode.min.js`

**OPCIÓN 3 - Con NPM:**
```bash
npm install qrcode
```
Luego copia `node_modules/qrcode/build/qrcode.min.js` a `/lib/`

---

## 🌐 Desplegar el Proyecto

### Opción A: Firebase Hosting (Recomendado)

```bash
# 1. Instalar Firebase CLI
npm install -g firebase-tools

# 2. Iniciar sesión
firebase login

# 3. Inicializar proyecto
firebase init hosting

# Selecciona:
# - Tu proyecto Firebase
# - Public directory: . (punto)
# - Configure as SPA: No
# - Set up automatic builds: No

# 4. Desplegar
firebase deploy
```

Tu sitio estará disponible en: `https://tu-proyecto.web.app`

### Opción B: GitHub Pages

1. Sube los archivos a un repositorio GitHub
2. Ve a **Settings** > **Pages**
3. Selecciona la rama `main` y carpeta `/root`
4. Guarda y espera el despliegue

### Opción C: Servidor Local

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (instala http-server globalmente)
npx http-server -p 8000
```

Abre: `http://localhost:8000`

---

## 📖 Uso del Sistema

### 🔐 Como Administrador

1. **Iniciar Sesión**
   - Ve a `index.html`
   - Ingresa email y contraseña del usuario admin creado

2. **Registrar Persona**
   - Completa el formulario en la parte superior
   - Campos obligatorios: Nombre, País, Código, Proyecto
   - Foto: Opcional
   - Haz clic en "Guardar Persona"

3. **Ver Código QR**
   - En la tabla, haz clic en "Ver QR"
   - Descarga o imprime el código

4. **Editar Persona**
   - Haz clic en "Editar"
   - Modifica los datos necesarios
   - Haz clic en "Actualizar Persona"

5. **Eliminar Persona**
   - Haz clic en "Eliminar"
   - Confirma la acción

### 📱 Como Usuario (Escaneando QR)

1. Escanea el código QR con cualquier app de cámara
2. Se abrirá automáticamente la página pública
3. Verás la información completa en un diseño moderno

---

## 🗄️ Estructura de Datos en Firestore

### Colección: `personas`

```javascript
{
  id: "uuid-generado-automáticamente",
  nombres_apellidos: "Juan Pérez García",
  pais: "México",
  codigo: "ABC123",
  proyecto: "Sistema QR 2024",
  foto_url: "https://storage.googleapis.com/...",
  creado: Timestamp,
  actualizado: Timestamp  // solo en ediciones
}
```

---

## 🎨 Personalización

### Cambiar Colores

Edita las variables CSS en `styles.css`:

```css
:root {
    --primary-color: #3B82F6;      /* Color principal */
    --primary-hover: #2563EB;      /* Hover del botón */
    --background: #F5F6FA;         /* Fondo general */
    --card-bg: #FFFFFF;            /* Fondo de tarjetas */
    /* ... más variables ... */
}
```

### Cambiar Fuente

En los archivos HTML, cambia:
```html
<link href="https://fonts.googleapis.com/css2?family=TU_FUENTE&display=swap" rel="stylesheet">
```

Y en `styles.css`:
```css
font-family: 'TU_FUENTE', sans-serif;
```

---

## 🔒 Seguridad

### Reglas de Firestore
- ✅ Solo admins autenticados pueden escribir
- ✅ Lectura pública solo para la colección `personas`

### Reglas de Storage
- ✅ Solo admins pueden subir fotos
- ✅ Lectura pública de imágenes

### Authentication
- ✅ Protección de ruta en `admin.html`
- ✅ Redirección automática si no está autenticado

---

## 🛠️ Solución de Problemas

### Error: "Firebase is not defined"
- Verifica que `firebase-config.js` tenga la configuración correcta
- Asegúrate de cargar los scripts de Firebase antes de tus archivos JS

### Error al subir fotos
- Revisa las reglas de Storage
- Verifica que el usuario esté autenticado

### QR no se genera
- Asegúrate de haber incluido `qrcode.min.js`
- Revisa la consola del navegador para errores

### No puedo iniciar sesión
- Verifica que el usuario exista en Firebase Authentication
- Revisa que Email/Password esté habilitado

---

## 📝 Licencia

Este proyecto es de código abierto y libre para usar con fines educativos y comerciales.

---

## 👨‍💻 Soporte

Para dudas o problemas:
1. Revisa la documentación de Firebase: https://firebase.google.com/docs
2. Verifica la consola del navegador (F12) para errores
3. Revisa las reglas de Firestore y Storage

---

## ✨ Mejoras Futuras Sugeridas

- [ ] Búsqueda y filtrado en la tabla
- [ ] Paginación para muchos registros
- [ ] Exportar datos a Excel/CSV
- [ ] Envío de QR por email
- [ ] Múltiples roles de usuario
- [ ] Estadísticas y dashboard
- [ ] Modo oscuro

---

**¡Listo para usar! 🚀**
