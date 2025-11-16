// Comprobación segura de Firebase
let db;
try {
    if (!window.firebase || !window.firebase.firestore) throw new Error('Firebase no inicializado');
    db = firebase.firestore();
} catch (err) {
    console.error('Firebase no disponible:', err);
    // Mostrar mensaje de error permanente en el loadingState
    const loadingStateEl = document.getElementById('loadingState');
    if (loadingStateEl) {
        loadingStateEl.innerHTML = `<div class="spinner"></div><p style="color:#fff; font-weight:700">Error: servicio no disponible</p><p style="color:#fff">Contacte al administrador</p>`;
        loadingStateEl.style.background = 'transparent';
    }
}

// Referencias al DOM
const loadingState = document.getElementById('loadingState');
const personCard = document.getElementById('personCard');
const personPhoto = document.getElementById('personPhoto');
const personName = document.getElementById('personName');
const personPais = document.getElementById('personPais');
const personCondicion = document.getElementById('personCondicion');
const personCodigoProyecto = document.getElementById('personCodigoProyecto');

// Obtener ID de la URL
function getPersonIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Cargar datos de la persona
async function loadPersonData() {
    const personId = getPersonIdFromUrl();
    
    if (!personId) {
        loadingState.innerHTML = '<div class="spinner"></div><p style="color:#fff; font-weight:700">ID no encontrado</p>';
        return;
    }
    
    try {
        if (!db) throw new Error('DB no disponible');

        const doc = await db.collection('personas').doc(personId).get();
        if (!doc.exists) {
            loadingState.innerHTML = '<div class="spinner"></div><p style="color:#fff; font-weight:700">Persona no encontrada</p>';
            return;
        }

        const persona = doc.data();
        displayPersonData(persona);
        
    } catch (error) {
        console.error('Error al cargar datos:', error);
        loadingState.innerHTML = `<div class="spinner"></div><p style="color:#fff; font-weight:700">Error al cargar datos</p><p style="color:#fff">${error.message}</p>`;
    }
}

// Mostrar datos de la persona
function displayPersonData(persona) {
    console.log('Datos recibidos:', persona); // Para debug
    
    // DEBUG: Mostrar en pantalla qué datos llegaron
    const debugInfo = `
        condicion: "${persona.condicion || 'VACIO'}"
        codigo_proyecto: "${persona.codigo_proyecto || 'VACIO'}"
        codigo: "${persona.codigo || 'VACIO'}"
        proyecto: "${persona.proyecto || 'VACIO'}"
    `;
    console.log('DEBUG:', debugInfo);
    
    // Ocultar loading
    loadingState.style.display = 'none';
    
    // Mostrar tarjeta
    personCard.style.display = 'block';
    
    // Mapear campos antiguos a nuevos para compatibilidad
    const condicion = persona.condicion || persona.condicion_tipo || '';
    const codigoProyecto = persona.codigo_proyecto || persona.codigo || persona.proyecto || '';

    console.log('FINAL condicion:', condicion);
    console.log('FINAL codigoProyecto:', codigoProyecto);

    // Llenar datos
    personName.textContent = persona.nombres_apellidos || 'No especificado';
    personCondicion.textContent = condicion || 'No especificado';
    personCodigoProyecto.textContent = codigoProyecto || 'No especificado';
    personPais.textContent = persona.pais || 'No especificado';
    
    // Foto
    if (persona.foto_url) {
        personPhoto.innerHTML = `<img src="${persona.foto_url}" alt="${persona.nombres_apellidos}">`;
    } else {
        personPhoto.innerHTML = '<div class="person-photo-placeholder">👤</div>';
    }
    
    // Actualizar título de la página
    document.title = `${persona.nombres_apellidos} - CIENTEC`;

    // Configurar botón de escanear de nuevo (compatible Android / iPhone)
    const scanAgainBtn = document.getElementById('scanAgainBtn');
    if (scanAgainBtn) {
        const goToScanner = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            sessionStorage.setItem('cameraPermissionGranted', 'true');
            window.location.href = 'scanner.html';
        };

        // Limpiar handlers previos por si el navegador los conserva
        scanAgainBtn.onclick = null;

        // Click funciona en la mayoría de navegadores
        scanAgainBtn.addEventListener('click', goToScanner);

        // touchend para iOS (cuando el click no se dispara)
        scanAgainBtn.addEventListener('touchend', goToScanner, { passive: false });
    } else {
        console.error('Botón scanAgainBtn no encontrado en el DOM');
    }
}

// Cargar datos al iniciar
loadPersonData();
