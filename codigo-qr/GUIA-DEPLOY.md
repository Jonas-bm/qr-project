# 🚀 GUÍA DE DEPLOYMENT A FIREBASE HOSTING

## ✅ PRE-REQUISITOS

Antes de hacer deploy, asegúrate de tener:

- [ ] Firebase CLI instalado
- [ ] Login en Firebase CLI
- [ ] Proyecto Firebase configurado
- [ ] Todos los archivos listos

---

## 📦 PASO 1: INSTALAR FIREBASE CLI (Si no lo tienes)

### Windows (PowerShell como Administrador):
```powershell
npm install -g firebase-tools
```

### Verificar instalación:
```powershell
firebase --version
```

Deberías ver algo como: `13.0.0` o superior

---

## 🔐 PASO 2: LOGIN EN FIREBASE

```powershell
firebase login
```

Esto abrirá tu navegador para que autorices con tu cuenta de Google.

### Verificar que estás logueado:
```powershell
firebase projects:list
```

Deberías ver tu proyecto `cientec-f1860` en la lista.

---

## 🎯 PASO 3: VERIFICAR CONFIGURACIÓN

### Verificar que estás en el proyecto correcto:
```powershell
firebase use
```

Debería mostrar: `cientec-f1860`

### Si no es el correcto, cambiarlo:
```powershell
firebase use cientec-f1860
```

---

## 🏗️ PASO 4: PREPARAR ARCHIVOS

### Verificar firebase.json
El archivo `firebase.json` debe tener:

```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/admin",
        "destination": "/admin.html"
      },
      {
        "source": "/persona",
        "destination": "/persona.html"
      }
    ]
  }
}
```

### Verificar .firebaserc
El archivo `.firebaserc` debe tener:

```json
{
  "projects": {
    "default": "cientec-f1860"
  }
}
```

---

## 🚀 PASO 5: HACER DEPLOY

### Deploy completo:
```powershell
firebase deploy
```

### Solo hosting (más rápido):
```powershell
firebase deploy --only hosting
```

### Salida esperada:
```
=== Deploying to 'cientec-f1860'...

i  deploying hosting
i  hosting[cientec-f1860]: beginning deploy...
i  hosting[cientec-f1860]: found X files in .
✔  hosting[cientec-f1860]: file upload complete
i  hosting[cientec-f1860]: finalizing version...
✔  hosting[cientec-f1860]: version finalized
i  hosting[cientec-f1860]: releasing new version...
✔  hosting[cientec-f1860]: release complete

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/cientec-f1860/overview
Hosting URL: https://cientec-f1860.web.app
```

---

## 🌐 PASO 6: VERIFICAR DEPLOYMENT

### Tu sitio estará disponible en:
```
https://cientec-f1860.web.app
```

O también en:
```
https://cientec-f1860.firebaseapp.com
```

### Probar las páginas:
- **Principal:** https://cientec-f1860.web.app/
- **Admin:** https://cientec-f1860.web.app/admin
- **Test:** https://cientec-f1860.web.app/test-firebase.html

---

## 🔧 COMANDOS ÚTILES DE FIREBASE CLI

### Ver hosting activo:
```powershell
firebase hosting:channel:list
```

### Ver logs:
```powershell
firebase hosting:channel:deploy preview
```

### Limpiar caché:
```powershell
firebase hosting:clone
```

### Rollback (volver a versión anterior):
```powershell
firebase hosting:rollback
```

---

## 🚨 SOLUCIÓN DE ERRORES COMUNES

### Error: "No project active"
**Solución:**
```powershell
firebase use cientec-f1860
```

### Error: "Authentication error"
**Solución:**
```powershell
firebase logout
firebase login
```

### Error: "Not authorized"
**Solución:**
Asegúrate de tener permisos en el proyecto Firebase Console.

### Error: "Cannot find firebase.json"
**Solución:**
Ejecuta el comando desde la raíz del proyecto:
```powershell
cd "d:\MY\DESARROLLO\CIENTEC\codigo-qr"
firebase deploy
```

### Error: "Hosting: no files to upload"
**Solución:**
Verifica que `firebase.json` tenga `"public": "."`

### Error: "Project ID mismatch"
**Solución:**
1. Abre `.firebaserc`
2. Cambia el ID a: `"cientec-f1860"`
3. Guarda y vuelve a hacer deploy

---

## 📋 CHECKLIST PRE-DEPLOY

- [ ] `firebase-config.js` tiene la configuración correcta
- [ ] `.firebaserc` apunta a `cientec-f1860`
- [ ] `firebase.json` tiene `"public": "."`
- [ ] Todos los archivos HTML están en la raíz
- [ ] Has hecho login en Firebase CLI
- [ ] Estás en el directorio correcto

---

## 🎯 PASOS RÁPIDOS (RESUMEN)

```powershell
# 1. Ir al directorio del proyecto
cd "d:\MY\DESARROLLO\CIENTEC\codigo-qr"

# 2. Verificar proyecto
firebase use

# 3. Deploy
firebase deploy --only hosting

# 4. Abrir en navegador
start https://cientec-f1860.web.app
```

---

## 🔄 ACTUALIZAR DESPUÉS DE CAMBIOS

Cada vez que hagas cambios en el código:

```powershell
# 1. Guardar todos los archivos
# 2. Hacer deploy
firebase deploy --only hosting

# 3. Esperar confirmación
# 4. Recargar la página web (Ctrl + Shift + R)
```

---

## 📊 VER ESTADÍSTICAS DE HOSTING

En Firebase Console:
1. Ve a: https://console.firebase.google.com/project/cientec-f1860/hosting
2. Verás:
   - Número de visitas
   - Ancho de banda usado
   - Versiones desplegadas
   - Historial de deployments

---

## 🌍 DOMINIO PERSONALIZADO (OPCIONAL)

### Agregar tu propio dominio:

1. Ve a Firebase Console → Hosting
2. Clic en "Agregar dominio personalizado"
3. Ingresa tu dominio (ej: qr.cientec.com)
4. Sigue las instrucciones para configurar DNS
5. Espera verificación (puede tomar 24 horas)

---

## 🔐 HTTPS AUTOMÁTICO

Firebase Hosting proporciona:
- ✅ Certificado SSL gratuito
- ✅ HTTPS automático
- ✅ Renovación automática
- ✅ Redirección HTTP → HTTPS

No necesitas configurar nada adicional.

---

## 📱 PREVIEW ANTES DE DEPLOY

Para probar antes de hacer deploy oficial:

```powershell
# Crear preview
firebase hosting:channel:deploy preview

# Te dará una URL temporal
# Ejemplo: https://cientec-f1860--preview-abc123.web.app
```

---

## ✅ POST-DEPLOY CHECKLIST

Después del deploy, verifica:

- [ ] La página principal carga: https://cientec-f1860.web.app
- [ ] Puedes hacer clic en ADMIN y PÚBLICO
- [ ] El login funciona
- [ ] Puedes crear personas en admin.html
- [ ] Los QR se generan correctamente
- [ ] La página persona.html?id=xxx funciona
- [ ] Las fotos se suben correctamente

---

## 🎉 ¡DEPLOY EXITOSO!

Tu aplicación ahora está disponible públicamente en:
```
https://cientec-f1860.web.app
```

Comparte esta URL con cualquiera que necesite acceder al sistema.

---

**Última actualización:** 14 de noviembre de 2025
**Proyecto:** cientec-f1860
**Hosting:** Firebase Hosting
