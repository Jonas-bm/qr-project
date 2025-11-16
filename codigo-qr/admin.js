// Referencias a Firebase
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

// Referencias al DOM
const personForm = document.getElementById('personForm');
const personIdInput = document.getElementById('personId');
const logoutBtn = document.getElementById('logoutBtn');
const personasTableBody = document.getElementById('personasTableBody');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const fotoInput = document.getElementById('foto');
const fotoPreview = document.getElementById('fotoPreview');
const qrModal = document.getElementById('qrModal');
const qrCodeContainer = document.getElementById('qrCodeContainer');
const qrPersonName = document.getElementById('qrPersonName');
const downloadQRBtn = document.getElementById('downloadQR');
const printQRBtn = document.getElementById('printQR');
const closeModal = document.querySelector('.close');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchResults = document.getElementById('searchResults');

// Variables globales
let editingPersonId = null;
let currentQRCanvas = null;
let fotoUrlActual = '';
let allPersonas = [];
let filteredPersonas = [];
let currentPage = 1;
const itemsPerPage = 10;

// Protección de ruta - verificar autenticación
auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = 'index.html';
    } else {
        loadPersonas();
    }
});

// Cerrar sesión
logoutBtn.addEventListener('click', async () => {
    try {
        await auth.signOut();
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión');
    }
});

// Preview de foto
fotoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            fotoPreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    } else {
        fotoPreview.innerHTML = '';
    }
});

// Función para generar ID único
function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Función para subir foto a Storage
async function uploadFoto(file, personId) {
    if (!file) return null;
    
    const storageRef = storage.ref();
    const fotoRef = storageRef.child(`personas/${personId}/${file.name}`);
    
    try {
        const snapshot = await fotoRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();
        return downloadURL;
    } catch (error) {
        console.error('Error al subir foto:', error);
        throw error;
    }
}

// Enviar formulario (Crear o Actualizar)
personForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando...';
    
    try {
        const nombresApellidos = document.getElementById('nombresApellidos').value;
        const pais = document.getElementById('pais').value;
        const condicion = document.getElementById('condicion').value;
        const codigoProyecto = document.getElementById('codigoProyecto').value;
        const fotoFile = fotoInput.files[0];
        
        let fotoUrl = fotoUrlActual; // Mantener foto actual si existe
        
        // Si hay una nueva foto, subirla
        if (fotoFile) {
            const personId = editingPersonId || generateId();
            fotoUrl = await uploadFoto(fotoFile, personId);
        }
        
        const personaData = {
            nombres_apellidos: nombresApellidos,
            pais: pais,
            condicion: condicion,
            codigo_proyecto: codigoProyecto,
            foto_url: fotoUrl || ''
        };
        
        if (editingPersonId) {
            // Actualizar persona existente
            await db.collection('personas').doc(editingPersonId).update({
                ...personaData,
                actualizado: firebase.firestore.FieldValue.serverTimestamp()
            });
            alert('Persona actualizada correctamente');
        } else {
            // Crear nueva persona
            const newId = generateId();
            await db.collection('personas').doc(newId).set({
                id: newId,
                ...personaData,
                creado: firebase.firestore.FieldValue.serverTimestamp()
            });
            alert('Persona registrada correctamente');
        }
        
        resetForm();
        loadPersonas();
        
    } catch (error) {
        console.error('Error al guardar persona:', error);
        alert('Error al guardar persona: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Guardar Persona';
    }
});

// Cancelar edición
cancelBtn.addEventListener('click', () => {
    resetForm();
});

// Resetear formulario
function resetForm() {
    personForm.reset();
    personIdInput.value = '';
    editingPersonId = null;
    fotoUrlActual = '';
    fotoPreview.innerHTML = '';
    formTitle.textContent = '➕ Registrar Nueva Persona';
    submitBtn.textContent = 'Guardar Persona';
    cancelBtn.style.display = 'none';
}

// Cargar todas las personas
async function loadPersonas() {
    try {
        personasTableBody.innerHTML = '<tr><td colspan="6" class="loading">Cargando datos...</td></tr>';
        
        const snapshot = await db.collection('personas').orderBy('creado', 'desc').get();
        
        if (snapshot.empty) {
            personasTableBody.innerHTML = '<tr><td colspan="6" class="loading">No hay personas registradas</td></tr>';
            document.getElementById('pagination').style.display = 'none';
            searchResults.textContent = '';
            return;
        }
        
        // Guardar todas las personas y ordenarlas alfabéticamente por nombre
        allPersonas = [];
        snapshot.forEach((doc) => {
            allPersonas.push(doc.data());
        });

        allPersonas.sort((a, b) => {
            const nombreA = (a.nombres_apellidos || '').toLowerCase();
            const nombreB = (b.nombres_apellidos || '').toLowerCase();
            if (nombreA < nombreB) return -1;
            if (nombreA > nombreB) return 1;
            return 0;
        });
        
        // Inicializar filteredPersonas con todas las personas
        filteredPersonas = [...allPersonas];
        
        // Resetear a la primera página
        currentPage = 1;
        updateSearchResults();
        updateStatistics();
        renderPage();
        
    } catch (error) {
        console.error('Error al cargar personas:', error);
        personasTableBody.innerHTML = '<tr><td colspan="6" class="loading">Error al cargar datos</td></tr>';
    }
}

// Filtrar personas por búsqueda
function filterPersonas(searchTerm) {
    console.log('Filtrando personas...', { 
        searchTerm, 
        totalPersonas: allPersonas.length,
        nombres: allPersonas.map(p => p.nombres_apellidos).slice(0, 3)
    });
    
    if (!searchTerm.trim()) {
        filteredPersonas = [...allPersonas];
    } else {
        const term = searchTerm.toLowerCase().trim();
        filteredPersonas = allPersonas.filter(persona => {
            const nombreCompleto = persona.nombres_apellidos.toLowerCase();
            return nombreCompleto.includes(term);
        });
    }
    
    console.log('Resultados filtrados:', filteredPersonas.length);
    
    // Resetear a la primera página después de filtrar
    currentPage = 1;
    updateSearchResults();
    updateStatistics();
    renderPage();
}

// Calcular y actualizar estadísticas
function updateStatistics() {
    const stats = {
        acompanante: 0,
        asesor: 0,
        expositor: 0,
        profesor: 0
    };
    
    allPersonas.forEach(persona => {
        const condicion = (persona.condicion || '').toLowerCase().trim();
        
        if (condicion.includes('acompañante') || condicion.includes('acompanante')) {
            stats.acompanante++;
        } else if (condicion.includes('asesor') || condicion.includes('asesora')) {
            stats.asesor++;
        } else if (condicion.includes('expositor') || condicion.includes('expositora')) {
            stats.expositor++;
        } else if (condicion.includes('profesor') || condicion.includes('profesora')) {
            stats.profesor++;
        }
    });
    
    // Actualizar los elementos en el DOM
    document.getElementById('totalAcompanante').textContent = stats.acompanante;
    document.getElementById('totalAsesor').textContent = stats.asesor;
    document.getElementById('totalExpositor').textContent = stats.expositor;
    document.getElementById('totalProfesor').textContent = stats.profesor;
    document.getElementById('totalGeneral').textContent = allPersonas.length;
}

// Actualizar contador de resultados de búsqueda
function updateSearchResults() {
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        searchResults.textContent = `Total: ${allPersonas.length} personas`;
        searchResults.classList.remove('active');
    } else {
        searchResults.textContent = `${filteredPersonas.length} resultado${filteredPersonas.length !== 1 ? 's' : ''} de ${allPersonas.length}`;
        searchResults.classList.add('active');
    }
}

// Renderizar página actual
function renderPage() {
    personasTableBody.innerHTML = '';
    
    if (filteredPersonas.length === 0) {
        personasTableBody.innerHTML = '<tr><td colspan="6" class="loading">No se encontraron personas con ese nombre</td></tr>';
        document.getElementById('pagination').style.display = 'none';
        return;
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pagePersonas = filteredPersonas.slice(startIndex, endIndex);
    
    pagePersonas.forEach((persona, index) => {
        const globalIndex = startIndex + index + 1;
        const row = createPersonaRow(persona, globalIndex);
        personasTableBody.appendChild(row);
    });
    
    updatePagination();
}

// Actualizar controles de paginación
function updatePagination() {
    const totalPages = Math.ceil(filteredPersonas.length / itemsPerPage);
    const pagination = document.getElementById('pagination');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    
    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }
    
    pagination.style.display = 'flex';
    pageInfo.textContent = `Página ${currentPage} de ${totalPages} (${filteredPersonas.length} persona${filteredPersonas.length !== 1 ? 's' : ''})`;
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

// Crear fila de tabla
function createPersonaRow(persona, numero) {
    const tr = document.createElement('tr');
    
    tr.innerHTML = `
        <td>${numero}</td>
        <td>${persona.nombres_apellidos}</td>
        <td>${persona.condicion || 'No especificado'}</td>
        <td>${persona.codigo_proyecto || 'No especificado'}</td>
        <td>${persona.pais}</td>
        <td>
            <div class="action-buttons">
                <button class="btn btn-primary btn-sm" onclick="viewQR('${persona.id}', '${persona.nombres_apellidos}')">
                    Ver QR
                </button>
                <button class="btn btn-success btn-sm" onclick="editPersona('${persona.id}')">
                    Editar
                </button>
                <button class="btn btn-danger btn-sm" onclick="deletePersona('${persona.id}', '${persona.nombres_apellidos}')">
                    Eliminar
                </button>
            </div>
        </td>
    `;
    
    return tr;
}

// Editar persona
async function editPersona(id) {
    try {
        const doc = await db.collection('personas').doc(id).get();
        
        if (!doc.exists) {
            alert('Persona no encontrada');
            return;
        }
        
        const persona = doc.data();
        
        // Llenar formulario
        document.getElementById('nombresApellidos').value = persona.nombres_apellidos;
        document.getElementById('pais').value = persona.pais;
        document.getElementById('condicion').value = persona.condicion || '';
        document.getElementById('codigoProyecto').value = persona.codigo_proyecto || '';
        
        // Si tiene foto, mostrar preview
        if (persona.foto_url) {
            fotoPreview.innerHTML = `<img src="${persona.foto_url}" alt="Foto actual">`;
            fotoUrlActual = persona.foto_url;
        }
        
        editingPersonId = id;
        formTitle.textContent = '✏️ Editar Persona';
        submitBtn.textContent = 'Actualizar Persona';
        cancelBtn.style.display = 'inline-flex';
        
        // Scroll al formulario
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error al cargar persona:', error);
        alert('Error al cargar datos de la persona');
    }
}

// Eliminar persona
async function deletePersona(id, nombre) {
    if (!confirm(`¿Estás seguro de eliminar a ${nombre}?`)) {
        return;
    }
    
    try {
        // Obtener datos para eliminar foto si existe
        const doc = await db.collection('personas').doc(id).get();
        const persona = doc.data();
        
        // Eliminar foto de Storage si existe
        if (persona.foto_url) {
            try {
                const fotoRef = storage.refFromURL(persona.foto_url);
                await fotoRef.delete();
            } catch (error) {
                console.warn('No se pudo eliminar la foto:', error);
            }
        }
        
        // Eliminar documento de Firestore
        await db.collection('personas').doc(id).delete();
        
        alert('Persona eliminada correctamente');
        loadPersonas();
        
    } catch (error) {
        console.error('Error al eliminar persona:', error);
        alert('Error al eliminar persona');
    }
}

// Ver código QR
function viewQR(id, nombre) {
    // Limpiar contenedor
    qrCodeContainer.innerHTML = '';
    
    // URL pública de la persona
    const personaUrl = `${window.location.origin}/persona.html?id=${id}`;
    
    try {
        // Crear un div temporal para el QR
        const qrDiv = document.createElement('div');
        qrCodeContainer.appendChild(qrDiv);
        
        // Generar QR usando QRCode constructor
        new QRCode(qrDiv, {
            text: personaUrl,
            width: 300,
            height: 300,
            colorDark: '#000000',
            colorLight: '#FFFFFF',
            correctLevel: QRCode.CorrectLevel.H
        });
        
        // Guardar el canvas para descarga (el QRCode crea un canvas automáticamente)
        setTimeout(() => {
            currentQRCanvas = qrDiv.querySelector('canvas');
            qrPersonName.textContent = nombre;
            qrModal.style.display = 'block';
        }, 100);
        
    } catch (error) {
        console.error('Error en viewQR:', error);
        alert('Error al generar código QR. Asegúrate de que la biblioteca QRCode está cargada.');
    }
}

// Descargar QR
downloadQRBtn.addEventListener('click', () => {
    if (!currentQRCanvas) return;
    
    const link = document.createElement('a');
    link.download = `qr-${qrPersonName.textContent.replace(/\s+/g, '-')}.png`;
    link.href = currentQRCanvas.toDataURL();
    link.click();
});

// Imprimir QR
printQRBtn.addEventListener('click', () => {
    if (!currentQRCanvas) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Imprimir QR - ${qrPersonName.textContent}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    padding: 40px;
                }
                h1 { margin-bottom: 20px; }
                img { margin: 20px 0; }
            </style>
        </head>
        <body>
            <h1>${qrPersonName.textContent}</h1>
            <img src="${currentQRCanvas.toDataURL()}" />
            <p>Código QR - Sistema de Gestión</p>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
});

// Cerrar modal
closeModal.addEventListener('click', () => {
    qrModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === qrModal) {
        qrModal.style.display = 'none';
    }
});

// Exponer funciones globalmente para los botones de la tabla
window.editPersona = editPersona;
window.deletePersona = deletePersona;
window.viewQR = viewQR;

// Event listeners de paginación
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderPage();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    const totalPages = Math.ceil(filteredPersonas.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderPage();
    }
});

// Event listeners de búsqueda
searchBtn.addEventListener('click', () => {
    filterPersonas(searchInput.value);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        filterPersonas(searchInput.value);
    }
});

// También filtrar mientras escribe (tiempo real)
searchInput.addEventListener('input', (e) => {
    filterPersonas(e.target.value);
});
