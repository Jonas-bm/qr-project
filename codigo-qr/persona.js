// Referencias a Firebase
const db = firebase.firestore();

// Referencias al DOM
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const personCard = document.getElementById('personCard');
const personPhoto = document.getElementById('personPhoto');
const personName = document.getElementById('personName');
const personPais = document.getElementById('personPais');
const personCodigo = document.getElementById('personCodigo');
const personProyecto = document.getElementById('personProyecto');

// Obtener ID de la URL
function getPersonIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Cargar datos de la persona
async function loadPersonData() {
    const personId = getPersonIdFromUrl();
    
    if (!personId) {
        showError();
        return;
    }
    
    try {
        const doc = await db.collection('personas').doc(personId).get();
        
        if (!doc.exists) {
            showError();
            return;
        }
        
        const persona = doc.data();
        displayPersonData(persona);
        
    } catch (error) {
        console.error('Error al cargar datos:', error);
        showError();
    }
}

// Mostrar datos de la persona
function displayPersonData(persona) {
    // Ocultar loading
    loadingState.style.display = 'none';
    
    // Mostrar tarjeta
    personCard.style.display = 'block';
    
    // Llenar datos
    personName.textContent = persona.nombres_apellidos;
    personPais.textContent = persona.pais;
    personCodigo.textContent = persona.codigo;
    personProyecto.textContent = persona.proyecto;
    
    // Foto
    if (persona.foto_url) {
        personPhoto.innerHTML = `<img src="${persona.foto_url}" alt="${persona.nombres_apellidos}">`;
    } else {
        personPhoto.innerHTML = '<div class="person-photo-placeholder">👤</div>';
    }
    
    // Actualizar título de la página
    document.title = `${persona.nombres_apellidos} - QR Info`;
}

// Mostrar error
function showError() {
    loadingState.style.display = 'none';
    errorState.style.display = 'block';
}

// Cargar datos al iniciar
loadPersonData();
