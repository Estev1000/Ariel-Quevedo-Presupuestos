// ======================
// PresupuestoPro â€“ Carpintería San José
// Sistema de Presupuestos â€“ LÃ³gica de la aplicaciÃ³n
// ======================

/********************  Almacenamiento persistente  ********************/

const CARPINTERIA_MATERIALES_DEFAULT = [
    { nombre: 'Puerta interior de madera (80x210cm)', unidad: 'unidad', precio: 0, stock: 0 },
    { nombre: 'Puerta exterior de madera (90x210cm)', unidad: 'unidad', precio: 0, stock: 0 },
    { nombre: 'Ventana de madera (100x100cm)', unidad: 'unidad', precio: 0, stock: 0 },
    { nombre: 'Marco de puerta de madera (80x210cm)', unidad: 'unidad', precio: 0, stock: 0 },
    { nombre: 'Marco de ventana de madera', unidad: 'unidad', precio: 0, stock: 0 },
    { nombre: 'Tablero de melamina (1,20x2,40m)', unidad: 'unidad', precio: 0, stock: 0 },
    { nombre: 'Tablero de MDF (1,20x2,40m)', unidad: 'unidad', precio: 0, stock: 0 },
    { nombre: 'Listón de pino (2x4x3m)', unidad: 'unidad', precio: 0, stock: 0 },
    { nombre: 'Listón de pino (2x6x3m)', unidad: 'unidad', precio: 0, stock: 0 },
    { nombre: 'Bastidor de madera para mueble', unidad: 'unidad', precio: 0, stock: 0 },
    { nombre: 'Estante de madera (1m)', unidad: 'unidad', precio: 0, stock: 0 },
    { nombre: 'Armario de madera (2 puertas)', unidad: 'unidad', precio: 0, stock: 0 },
    { nombre: 'Closet de madera empotrado', unidad: 'unidad', precio: 0, stock: 0 },
    { nombre: 'Barniz para madera (litro)', unidad: 'litro', precio: 0, stock: 0 },
    { nombre: 'Pintura para madera (litro)', unidad: 'litro', precio: 0, stock: 0 },
    { nombre: 'Tornillos para madera (caja x 100)', unidad: 'cajax100', precio: 0, stock: 0 },
    { nombre: 'Clavos para madera (caja x 500)', unidad: 'cajax500', precio: 0, stock: 0 },
    { nombre: 'Bisagra para puerta (par)', unidad: 'unidad', precio: 0, stock: 0 },
    { nombre: 'Cerradura para puerta', unidad: 'unidad', precio: 0, stock: 0 },
    { nombre: 'Chapa para puerta', unidad: 'unidad', precio: 0, stock: 0 }
];

const CARPINTERIA_SERVICIOS_DEFAULT = [
    { nombre: 'Instalación de puerta interior', unidad: 'unidad', precio: 0, tiempo: 0 },
    { nombre: 'Instalación de puerta exterior', unidad: 'unidad', precio: 0, tiempo: 0 },
    { nombre: 'Instalación de ventana de madera', unidad: 'unidad', precio: 0, tiempo: 0 },
    { nombre: 'Instalación de closet empotrado', unidad: 'global', precio: 0, tiempo: 0 },
    { nombre: 'Instalación de armario de madera', unidad: 'unidad', precio: 0, tiempo: 0 },
    { nombre: 'Reparación de mueble de madera', unidad: 'hora', precio: 0, tiempo: 0 },
    { nombre: 'Barnizado de madera (m²)', unidad: 'm2', precio: 0, tiempo: 0 },
    { nombre: 'Lijado de madera (m²)', unidad: 'm2', precio: 0, tiempo: 0 },
    { nombre: 'Pintura de madera (m²)', unidad: 'm2', precio: 0, tiempo: 0 },
    { nombre: 'Carpintería a medida (hora)', unidad: 'hora', precio: 0, tiempo: 0 },
    { nombre: 'Fabricación de puerta a medida', unidad: 'unidad', precio: 0, tiempo: 0 },
    { nombre: 'Fabricación de ventana a medida', unidad: 'unidad', precio: 0, tiempo: 0 },
    { nombre: 'Fabricación de mueble a medida', unidad: 'global', precio: 0, tiempo: 0 },
    { nombre: 'Restauración de mueble antiguo', unidad: 'global', precio: 0, tiempo: 0 },
    { nombre: 'Colocación de revestimiento de madera', unidad: 'm2', precio: 0, tiempo: 0 },
    { nombre: 'Instalación de deck de madera', unidad: 'm2', precio: 0, tiempo: 0 }
];

function normalizarTexto(t) {
    if (typeof t !== 'string') return t;
    return t
        .replaceAll('â€“', '-')
        .replaceAll('Â¿', '¿')
        .replaceAll('Â¡', '¡')
        .replaceAll('mÂ²', 'm²')
        .replaceAll('DÃ­a', 'Día')
        .replaceAll('DÃ­as', 'Días')
        .replaceAll('Ã¡', 'á')
        .replaceAll('Ã©', 'é')
        .replaceAll('Ã­', 'í')
        .replaceAll('Ã³', 'ó')
        .replaceAll('Ãº', 'ú')
        .replaceAll('Ã±', 'ñ')
        .replaceAll('Ã', 'Í')
        .replaceAll('Ã“', 'Ó')
        .replaceAll('Ãš', 'Ú')
        .replaceAll('Ã‘', 'Ñ');
}

function normalizarDB() {
    if (!db) return;
    const arrays = ['clientes', 'materiales', 'servicios', 'presupuestos'];
    arrays.forEach(k => {
        if (!Array.isArray(db[k])) return;
        db[k] = db[k].map(item => {
            if (!item || typeof item !== 'object') return item;
            const out = Array.isArray(item) ? [...item] : { ...item };
            Object.keys(out).forEach(key => {
                if (typeof out[key] === 'string') out[key] = normalizarTexto(out[key]);
            });
            if (typeof out.html === 'string') out.html = normalizarTexto(out.html);
            if (Array.isArray(out.materiales)) {
                out.materiales = out.materiales.map(m => ({ ...m, nombre: normalizarTexto(m.nombre) }));
            }
            if (Array.isArray(out.servicios)) {
                out.servicios = out.servicios.map(s => ({ ...s, nombre: normalizarTexto(s.nombre) }));
            }
            return out;
        });
    });
}

function guardarDatos() {
    localStorage.setItem('presupuestosDB', JSON.stringify(db));
}

function cargarDatos() {
    const datosGuardados = localStorage.getItem('presupuestosDB');
    if (datosGuardados) {
        db = JSON.parse(datosGuardados);
        if (!db.presupuestos) db.presupuestos = [];
        if (!db.carpinteriaMateriales) db.carpinteriaMateriales = [];
        if (!db.carpinteriaServicios) db.carpinteriaServicios = [];
        if (!db.clientes) db.clientes = [];
        normalizarDB();
    } else {
        db = {
            clientes: [],
            carpinteriaMateriales: [],
            carpinteriaServicios: [],
            presupuestos: []
        };
    }

    // Agregar materiales de carpintería predeterminados que todavÃ­a no existan (por nombre)
    CARPINTERIA_MATERIALES_DEFAULT.forEach(def => {
        const existe = db.carpinteriaMateriales.some(
            c => c.nombre.trim().toLowerCase() === def.nombre.trim().toLowerCase()
        );
        if (!existe) {
            db.carpinteriaMateriales.unshift(Object.assign({}, def));
        }
    });

    // Agregar servicios de carpintería predeterminados que todavÃ­a no existan (por nombre)
    CARPINTERIA_SERVICIOS_DEFAULT.forEach(def => {
        const existe = db.carpinteriaServicios.some(
            c => c.nombre.trim().toLowerCase() === def.nombre.trim().toLowerCase()
        );
        if (!existe) {
            db.carpinteriaServicios.unshift(Object.assign({}, def));
        }
    });

    guardarDatos();
}

// Cargar datos al inicio
cargarDatos();

// Guardar datos automÃ¡ticamente cuando se modifican
window.addEventListener('beforeunload', guardarDatos);

/********************  Utilidades  ********************/
function qs(id) {
    return document.getElementById(id);
}

// --------------------
// Generar HTML del presupuesto actual
// --------------------
function generarHTMLPresupuesto() {
    const cliente = qs('cliente-presupuesto').value || 'Cliente sin nombre';
    const nombrePres = qs('nombre-presupuesto').value || 'Presupuesto sin título';
    const fecha = qs('fecha-presupuesto').value || new Date().toISOString().substring(0,10);
    const validez = qs('validez-presupuesto').value || '30';
    const notas = qs('notas-presupuesto').value || '';

    // Construir listas
    let htmlMat = '';
    document.querySelectorAll('#lista-materiales-presupuesto li').forEach(li => {
        htmlMat += `<tr><td>${li.textContent}</td></tr>`;
    });
    let htmlSer = '';
    document.querySelectorAll('#lista-servicios-presupuesto li').forEach(li => {
        htmlSer += `<tr><td>${li.textContent}</td></tr>`;
    });

    const subtotalMat = qs('subtotal-materiales').textContent;
    const subtotalSer = qs('subtotal-servicios').textContent;
    const total        = qs('total-presupuesto').textContent;

    return `
        <div class="membrete">
            <div class="membrete-logo"><i class="fas fa-hard-hat" style="font-size:1.4rem;color:#1a3a5c;"></i></div>
            <div class="membrete-info">
                <h1 class="empresa-nombre">PresupuestoPro</h1>
                <p class="empresa-rubro">Carpintería San José - Madera</p>
            </div>
        </div>
        <hr class="membrete-hr">
        <h2 class="presupuesto-titulo">${nombrePres}</h2>
        <table class="tabla-datos">
            <tr><td><strong>Cliente:</strong></td><td>${cliente}</td></tr>
            <tr><td><strong>Fecha:</strong></td><td>${fecha}</td></tr>
            <tr><td><strong>Validez:</strong></td><td>${validez} días</td></tr>
        </table>
        ${htmlMat ? `<h3>Materiales de Carpintería</h3><table class="tabla-items">${htmlMat}</table>` : ''}
        ${htmlSer ? `<h3>Mano de Obra de Carpintería</h3><table class="tabla-items">${htmlSer}</table>` : ''}
        <div class="resumen-print">
            ${htmlMat ? `<div class="resumen-fila-print"><span>Subtotal Materiales:</span><span>${subtotalMat}</span></div>` : ''}
            ${htmlSer ? `<div class="resumen-fila-print"><span>Subtotal Mano de Obra:</span><span>${subtotalSer}</span></div>` : ''}
            <div class="resumen-fila-print total-print"><span><strong>TOTAL:</strong></span><span><strong>${total}</strong></span></div>
        </div>
        ${notas ? `<div class="notas-print"><h4>Notas / Especificaciones técnicas</h4><p>${notas.replace(/\n/g,'<br>')}</p></div>` : ''}
        <div class="firma-print">
            <p>PresupuestoPro</p>
            <p style="color:#888;font-size:0.85rem">Carpintería San José</p>
        </div>
    `;
}

// Funciones para compartir presupuestos
function imprimirPresupuesto() {
    try {
        let presupuesto = qs('contenido-modal').innerHTML;
        if (!presupuesto) {
            presupuesto = generarHTMLPresupuesto();
            qs('contenido-modal').innerHTML = presupuesto;
        }
        
        const ventana = window.open('', '_blank');
        ventana.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Presupuesto - PresupuestoPro</title>
                <style>
                    @media print {
                        @page { margin: 1.5cm; }
                        body { margin: 0; }
                    }
                    body { font-family: Arial, sans-serif; padding: 24px; color: #1e2a38; font-size: 14px; }
                    .presupuesto { max-width: 820px; margin: 0 auto; }
                    .membrete { display: flex; align-items: center; gap: 18px; margin-bottom: 10px; }
                    .membrete-logo {
                        width: 60px; height: 60px; border-radius: 50%;
                        background: linear-gradient(135deg, #e8a020, #c4861a);
                        display: flex; align-items: center; justify-content: center;
                        font-size: 1.2rem; font-weight: 800; color: #1a3a5c;
                        flex-shrink: 0;
                    }
                    .empresa-nombre { margin: 0; font-size: 1.4rem; color: #1a3a5c; }
                    .empresa-rubro { margin: 2px 0 0; color: #666; font-size: 0.85rem; }
                    .membrete-hr { border: 0; border-top: 3px solid #e8a020; margin: 12px 0 18px; }
                    .presupuesto-titulo { color: #1a3a5c; font-size: 1.2rem; margin-bottom: 14px; }
                    .tabla-datos { margin-bottom: 18px; }
                    .tabla-datos td { padding: 4px 12px 4px 0; }
                    h3 { color: #1a3a5c; margin: 18px 0 8px; font-size: 1rem; border-left: 4px solid #e8a020; padding-left: 8px; }
                    .tabla-items { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
                    .tabla-items tr td { border: 1px solid #d0d7e0; padding: 7px 10px; }
                    .tabla-items tr:nth-child(even) td { background: #f5f8fd; }
                    .resumen-print { background: #f0f4fb; border-radius: 8px; padding: 14px 18px; margin: 18px 0; border: 1px solid #c8d4e8; }
                    .resumen-fila-print { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px dashed #c8d4e8; font-size: 0.97rem; }
                    .resumen-fila-print:last-child { border-bottom: none; }
                    .total-print { font-size: 1.2rem; margin-top: 6px; padding-top: 8px; border-top: 2px solid #1a3a5c !important; }
                    .notas-print { background: #fffbf0; border-left: 4px solid #e8a020; padding: 12px 16px; margin: 16px 0; border-radius: 0 8px 8px 0; }
                    .notas-print h4 { margin: 0 0 6px; color: #1a3a5c; }
                    .firma-print { margin-top: 40px; text-align: right; font-weight: 600; color: #1a3a5c; }
                </style>
            </head>
            <body>
                <div class="presupuesto">
                    ${presupuesto}
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                        window.onafterprint = function() { window.close(); };
                    };
                <\/script>
            </body>
            </html>
        `);
        ventana.document.close();
    } catch (error) {
        console.error('Error al imprimir:', error);
        alert('Error al imprimir el presupuesto');
    }
}

function enviarPorWhatsApp() {
    try {
        // Generate presupuesto directly from form data
        const presupuesto = generarHTMLPresupuesto();
        
        const cliente = qs('cliente-presupuesto').value || 'Cliente';
        // Intentar obtener teléfono desde el campo de clientes (si el form está visible)
        let telefono = qs('telefono-cliente') ? qs('telefono-cliente').value.trim() : '';
        // Si no se escribió manualmente, buscar el teléfono del cliente seleccionado en la base
        if ((!telefono || telefono === '') && cliente) {
            const cliObj = (typeof db !== 'undefined') ? db.clientes.find(c => c.nombre === cliente) : null;
            if (cliObj) telefono = (cliObj.telefono || '').trim();
        }

        // Quitar espacios y caracteres no numéricos
        telefono = telefono.replace(/[^0-9]/g, '');

        if (!telefono || telefono.length < 6) {
            const telPrompt = prompt('Ingrese número de teléfono del cliente (solo dígitos, con código de área):');
            telefono = (telPrompt || '').replace(/[^0-9]/g, '');
            if (!telefono || telefono.length < 6) {
                alert('Por favor, ingrese un número de teléfono válido');
                return;
            }
        }

        // Asegurar cÃ³digo de paÃ­s â€“ Ejemplo Argentina 54, si ya empieza con 54 lo dejamos
        if (!telefono.startsWith('54')) {
            telefono = '54' + telefono.replace(/^0+/, ''); // quitar ceros iniciales antes de anteponer 54
        }

        // Generate message with presupuesto
        const mensaje = `Hola ${cliente},%0A%0AAdjunto encontrará su presupuesto:%0A%0A${presupuesto.replace(/<[^>]+>/g, '')}%0A%0ASaludos cordiales.`;

        const urlWhats = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
        window.open(urlWhats, '_blank');
    } catch (error) {
        console.error('Error al enviar WhatsApp:', error);
        alert('Error al enviar el presupuesto por WhatsApp');
    }
}

// Event listeners para botones de compartir
const btnImprimir = qs('imprimir-presupuesto');
const btnWhatsApp = qs('enviar-whatsapp');

if (btnImprimir) btnImprimir.addEventListener('click', imprimirPresupuesto);
if (btnWhatsApp) btnWhatsApp.addEventListener('click', enviarPorWhatsApp);

// --------------------
// CÃ¡lculo y actualizaciÃ³n de subtotales / total
// --------------------
function actualizarTotalesPresupuesto() {
    let subtotalMateriales = 0;
    let subtotalServicios = 0;

    // Recorrer materiales agregados
    const listaMateriales = document.querySelectorAll('#lista-materiales-presupuesto li');
    listaMateriales.forEach(item => {
        const cantidad = parseFloat(item.dataset.cantidad);
        const precio   = parseFloat(item.dataset.precio);
        if (!isNaN(cantidad) && !isNaN(precio)) {
            subtotalMateriales += cantidad * precio;
        }
    });

    // Recorrer servicios agregados
    const listaServicios = document.querySelectorAll('#lista-servicios-presupuesto li');
    listaServicios.forEach(item => {
        const cantidad = parseFloat(item.dataset.cantidad);
        const precio   = parseFloat(item.dataset.precio);
        if (!isNaN(cantidad) && !isNaN(precio)) {
            subtotalServicios += cantidad * precio;
        }
    });

    // Pintar resultados
    qs('subtotal-materiales').textContent = `${subtotalMateriales.toFixed(2)}`;
    qs('subtotal-servicios').textContent  = `${subtotalServicios.toFixed(2)}`;
    qs('total-presupuesto').textContent   = `${(subtotalMateriales + subtotalServicios).toFixed(2)}`;
}

// --------------------
// AÃ±adir material y servicio al presupuesto
// --------------------
const btnAgregarMaterial  = qs('agregar-material');
const btnAgregarServicio  = qs('agregar-servicio');

if (btnAgregarMaterial) {
    btnAgregarMaterial.addEventListener('click', () => {
        const materialSel = qs('material-presupuesto');
        const cantidadInp = qs('cantidad-material');
        const cantidad    = parseFloat(cantidadInp.value);
        if (!materialSel.value || isNaN(cantidad) || cantidad <= 0) return;
        const material = db.carpinteriaMateriales.find(m => m.nombre === materialSel.value);
        if (!material) return;

        const li = document.createElement('li');
        li.dataset.cantidad = cantidad;
        li.dataset.precio   = material.precio;
        li.textContent = `${material.nombre} x ${cantidad} ${material.unidad} = ${(cantidad * material.precio).toFixed(2)}`;
        li.appendChild(crearBoton('<i class="fas fa-trash"></i>', 'btn-action', () => {
            li.remove();
            actualizarTotalesPresupuesto();
        }));
        qs('lista-materiales-presupuesto').appendChild(li);
        cantidadInp.value = '';
        actualizarTotalesPresupuesto();
    });
}

if (btnAgregarServicio) {
    btnAgregarServicio.addEventListener('click', () => {
        const servicioSel = qs('servicio-presupuesto');
        const cantidadInp = qs('cantidad-servicio');
        const cantidad    = parseFloat(cantidadInp.value);
        if (!servicioSel.value || isNaN(cantidad) || cantidad <= 0) return;
        const servicio = db.carpinteriaServicios.find(s => s.nombre === servicioSel.value);
        if (!servicio) return;

        const li = document.createElement('li');
        li.dataset.cantidad = cantidad;
        li.dataset.precio   = servicio.precio;
        li.textContent = `${servicio.nombre} x ${cantidad} ${servicio.unidad} = ${(cantidad * servicio.precio).toFixed(2)}`;
        li.appendChild(crearBoton('<i class="fas fa-trash"></i>', 'btn-action', () => {
            li.remove();
            actualizarTotalesPresupuesto();
        }));
        qs('lista-servicios-presupuesto').appendChild(li);
        cantidadInp.value = '';
        actualizarTotalesPresupuesto();
    });
}

function crearBoton(html, clase, listener) {
    const btn = document.createElement('button');
    btn.innerHTML = html;
    btn.className = clase;
    btn.addEventListener('click', listener);
    return btn;
}

/********************  CLIENTES  ********************/
(() => {
    const form = qs('form-cliente');
    const lista = qs('lista-clientes');
    const buscar = qs('buscar-cliente');

    let indexEdit = null; // Ãndice del cliente que se estÃ¡ editando (null = nuevo)

    function limpiarFormulario() {
        form.reset();
        indexEdit = null;
        form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-user-plus"></i> Agregar Cliente';
    }

    function renderLista(filtro = '') {
        lista.innerHTML = '';
        db.clientes
            .filter(c => Object.values(c).some(v => v.toLowerCase().includes(filtro.toLowerCase())))
            .forEach(cliente => {
                const realIndex = db.clientes.indexOf(cliente);
                const li = document.createElement('li');
                li.textContent = `${cliente.nombre} - ${cliente.telefono} - ${cliente.email} - ${cliente.direccion}`;

                // Botones acciÃ³n
                li.appendChild(crearBoton('<i class="fas fa-edit"></i>', 'btn-action', () => editar(realIndex)));
                li.appendChild(crearBoton('<i class="fas fa-trash"></i>', 'btn-action', () => eliminar(realIndex)));
                lista.appendChild(li);
            });
    }

    function editar(i) {
        const c = db.clientes[i];
        qs('nombre-cliente').value = c.nombre;
        qs('telefono-cliente').value = c.telefono;
        qs('email-cliente').value = c.email;
        qs('direccion-cliente').value = c.direccion;
        indexEdit = i;
        form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
    }

    function eliminar(i) {
        if (!confirm('¿Eliminar este cliente?')) return;
        db.clientes.splice(i, 1);
        renderLista(buscar.value);
    }

    // Enviar formulario (crear o actualizar)
    form.addEventListener('submit', e => {
        e.preventDefault();
        const nuevo = {
            nombre: qs('nombre-cliente').value.trim(),
            telefono: qs('telefono-cliente').value.trim(),
            email: qs('email-cliente').value.trim(),
            direccion: qs('direccion-cliente').value.trim()
        };
        if (indexEdit === null) {
            db.clientes.push(nuevo);
        } else {
            db.clientes[indexEdit] = nuevo;
        }
        limpiarFormulario();
        renderLista(buscar.value);
        if (typeof actualizarSelectClientes === 'function') actualizarSelectClientes();
    });

    // Buscar
    buscar.addEventListener('input', () => renderLista(buscar.value));

    // Inicial
    renderLista();
    if (typeof actualizarSelectClientes === 'function') actualizarSelectClientes();
})();

/********************  MATERIALES  ********************/
(() => {
    const form = qs('form-material');
    const lista = qs('lista-materiales');
    const buscar = qs('buscar-material');

    let indexEdit = null;

    function limpiarFormulario() {
        form.reset();
        indexEdit = null;
        form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-plus"></i> Agregar Material';
    }

    function renderLista(filtro = '') {
        lista.innerHTML = '';
        db.carpinteriaMateriales
            .filter(m => Object.values(m).some(v => String(v).toLowerCase().includes(filtro.toLowerCase())))
            .forEach(mat => {
                const realIndex = db.carpinteriaMateriales.indexOf(mat);
                const li = document.createElement('li');
                li.textContent = `${mat.nombre} - ${mat.unidad} - $${Number(mat.precio).toFixed(2)} - Stock: ${mat.stock || 0}`;
                li.appendChild(crearBoton('<i class="fas fa-edit"></i>', 'btn-action', () => editar(realIndex)));
                li.appendChild(crearBoton('<i class="fas fa-trash"></i>', 'btn-action', () => eliminar(realIndex)));
                lista.appendChild(li);
            });
    }

    function editar(i) {
        // Mostrar la sección de materiales
        document.querySelectorAll('.seccion-app').forEach(sec => sec.style.display = 'none');
        qs('materiales').style.display = 'block';
        
        const m = db.carpinteriaMateriales[i];
        qs('nombre-material').value = m.nombre;
        qs('unidad-material').value = m.unidad;
        qs('precio-material').value = m.precio;
        qs('stock-material').value = m.stock;
        indexEdit = i;
        form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        qs('nombre-material').focus();
    }

    function eliminar(i) {
        if (!confirm('¿Eliminar este material?')) return;
        db.carpinteriaMateriales.splice(i, 1);
        renderLista(buscar.value);
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        const nuevo = {
            nombre: qs('nombre-material').value.trim(),
            unidad: qs('unidad-material').value,
            precio: parseFloat(qs('precio-material').value || 0),
            stock: parseFloat(qs('stock-material').value || 0)
        };
        if (indexEdit === null) {
            db.carpinteriaMateriales.push(nuevo);
        } else {
            db.carpinteriaMateriales[indexEdit] = nuevo;
        }
        limpiarFormulario();
        renderLista(buscar.value);
        // Actualizar select de materiales en presupuesto
        actualizarSelectMateriales();
    });

    buscar.addEventListener('input', () => renderLista(buscar.value));

    renderLista();
})();

/********************  SERVICIOS (Mano de obra)  ********************/
(() => {
    const form = qs('form-servicio');
    const lista = qs('lista-servicios');
    const buscar = qs('buscar-servicio');

    let indexEdit = null;

    function limpiarFormulario() {
        form.reset();
        indexEdit = null;
        form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-tools"></i> Agregar Servicio';
    }

    function renderLista(filtro = '') {
        lista.innerHTML = '';
        db.carpinteriaServicios
            .filter(s => Object.values(s).some(v => String(v).toLowerCase().includes(filtro.toLowerCase())))
            .forEach(ser => {
                const realIndex = db.carpinteriaServicios.indexOf(ser);
                const li = document.createElement('li');
                li.textContent = `${ser.nombre} - ${ser.unidad} - $${Number(ser.precio).toFixed(2)} - Tiempo: ${ser.tiempo || 0}h`;
                li.appendChild(crearBoton('<i class="fas fa-edit"></i>', 'btn-action', () => editar(realIndex)));
                li.appendChild(crearBoton('<i class="fas fa-trash"></i>', 'btn-action', () => eliminar(realIndex)));
                lista.appendChild(li);
            });
    }

    function editar(i) {
        // Mostrar la sección de mano de obra (servicios)
        document.querySelectorAll('.seccion-app').forEach(sec => sec.style.display = 'none');
        qs('mano-obra').style.display = 'block';
        
        const s = db.carpinteriaServicios[i];
        qs('nombre-servicio').value = s.nombre;
        qs('unidad-servicio').value = s.unidad;
        qs('precio-servicio').value = s.precio;
        qs('tiempo-servicio').value = s.tiempo;
        indexEdit = i;
        form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        qs('nombre-servicio').focus();
    }

    function eliminar(i) {
        if (!confirm('¿Eliminar este servicio?')) return;
        db.carpinteriaServicios.splice(i, 1);
        renderLista(buscar.value);
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        const nuevo = {
            nombre: qs('nombre-servicio').value.trim(),
            unidad: qs('unidad-servicio').value,
            precio: parseFloat(qs('precio-servicio').value || 0),
            tiempo: parseFloat(qs('tiempo-servicio').value || 0)
        };
        if (indexEdit === null) {
            db.carpinteriaServicios.push(nuevo);
        } else {
            db.carpinteriaServicios[indexEdit] = nuevo;
        }
        limpiarFormulario();
        renderLista(buscar.value);
        actualizarSelectServicios();
    });

    buscar.addEventListener('input', () => renderLista(buscar.value));

    renderLista();
})();

/********************  NAVEGACIÃ“N ENTRE SECCIONES  ********************/
(() => {
    const enlaces = document.querySelectorAll('nav a');
    enlaces.forEach(link => {
        link.addEventListener('click', function(e){
            e.preventDefault();
            const destino = this.getAttribute('href');
            if (!destino || destino === '#') return;
            // Mostrar secciÃ³n correspondiente
            document.querySelectorAll('.seccion-app').forEach(sec => sec.style.display = 'none');
            document.querySelector(destino).style.display = 'block';
            // Activar enlace actual
            enlaces.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
})();

/********************  PRESUPUESTOS (operaciones bÃ¡sicas)  ********************/
(() => {
    // Solo un bosquejo mÃ­nimo para permitir seleccionar clientes, materiales y servicios
    const selectCliente = qs('cliente-presupuesto');
    const selectMaterial = qs('material-presupuesto');
    const selectServicio = qs('servicio-presupuesto');

    window.actualizarSelectClientes = function() {
        selectCliente.innerHTML = '<option value="">Seleccionar Cliente</option>';
        db.clientes.forEach(c => {
            const op = document.createElement('option');
            op.value = c.nombre;
            op.textContent = c.nombre;
            selectCliente.appendChild(op);
        });
    };

    window.actualizarSelectMateriales = function() {
        selectMaterial.innerHTML = '<option value="">Seleccionar Material</option>';
        db.carpinteriaMateriales.forEach(m => {
            const op = document.createElement('option');
            op.value = m.nombre;
            op.textContent = `${m.nombre} ($${Number(m.precio).toFixed(2)})`;
            selectMaterial.appendChild(op);
        });
    };

    window.actualizarSelectServicios = function() {
        selectServicio.innerHTML = '<option value="">Seleccionar Servicio</option>';
        db.carpinteriaServicios.forEach(s => {
            const op = document.createElement('option');
            op.value = s.nombre;
            op.textContent = `${s.nombre} ($${Number(s.precio).toFixed(2)})`;
            selectServicio.appendChild(op);
        });
    };

    // Actualizar selects directo cuando cambien las bases (se llama de forma explÃ­cita)
    actualizarSelectClientes();
    actualizarSelectMateriales();
    actualizarSelectServicios();

    // --------- Guardar Presupuesto ----------
    const btnGuardarPresupuesto = qs('guardar-presupuesto');
    const listaPresupuestos = qs('lista-presupuestos');
    const buscarPresupuesto = qs('buscar-presupuesto');
    const modalPresupuesto = document.getElementById('modal-presupuesto');
    const modalContenido   = qs('contenido-modal');
    const cerrarModal      = modalPresupuesto ? modalPresupuesto.querySelector('.cerrar-modal') : null;

    function obtenerDatosPresupuesto() {
        const cliente   = selectCliente.value || 'Cliente sin nombre';
        const nombre    = qs('nombre-presupuesto').value || 'Presupuesto sin título';
        const fecha     = qs('fecha-presupuesto').value || new Date().toISOString().substring(0,10);
        const validez   = qs('validez-presupuesto').value || '30';
        const notas     = qs('notas-presupuesto').value || '';

        const materiales = [];
        document.querySelectorAll('#lista-materiales-presupuesto li').forEach(li => {
            materiales.push({
                nombre: li.textContent,
                cantidad: li.dataset.cantidad,
                precio: li.dataset.precio
            });
        });

        const servicios = [];
        document.querySelectorAll('#lista-servicios-presupuesto li').forEach(li => {
            servicios.push({
                nombre: li.textContent,
                cantidad: li.dataset.cantidad,
                precio: li.dataset.precio
            });
        });

        const subtotalMateriales = qs('subtotal-materiales').textContent;
        const subtotalServicios  = qs('subtotal-servicios').textContent;
        const total              = qs('total-presupuesto').textContent;

        return {
            id: Date.now(),
            cliente,
            nombre,
            fecha,
            validez,
            notas,
            materiales,
            servicios,
            subtotalMateriales,
            subtotalServicios,
            total,
            html: generarHTMLPresupuesto()
        };
    }

    function renderListaPresupuestos(filtro = '') {
        if (!listaPresupuestos) return;
        listaPresupuestos.innerHTML = '';
        db.presupuestos
            .filter(p => Object.values(p).some(v => String(v).toLowerCase().includes(filtro.toLowerCase())))
            .forEach((p, idx) => {
                const li = document.createElement('li');
                li.textContent = `${p.nombre} - ${p.cliente} - ${p.fecha} - ${p.total}`;
                li.appendChild(crearBoton('<i class="fas fa-eye"></i>', 'btn-action', () => verPresupuesto(idx)));
                li.appendChild(crearBoton('<i class="fas fa-trash"></i>', 'btn-action', () => eliminarPresupuesto(idx)));
                listaPresupuestos.appendChild(li);
            });
    }

    // Cargar presupuesto en el formulario para poder editar / reimprimir
    function cargarPresupuestoEnFormulario(p) {
        // Datos bÃ¡sicos
        selectCliente.value = p.cliente || '';
        qs('nombre-presupuesto').value = p.nombre || '';
        qs('fecha-presupuesto').value = p.fecha || '';
        qs('validez-presupuesto').value = p.validez || 30;
        qs('notas-presupuesto').value = p.notas || '';

        // Limpiar listas actuales
        qs('lista-materiales-presupuesto').innerHTML = '';
        qs('lista-servicios-presupuesto').innerHTML = '';

        // Cargar materiales
        if (Array.isArray(p.materiales)) {
            p.materiales.forEach(mat => {
                const li = document.createElement('li');
                li.dataset.cantidad = mat.cantidad;
                li.dataset.precio   = mat.precio;
                li.textContent = mat.nombre;
                li.appendChild(crearBoton('<i class="fas fa-trash"></i>', 'btn-action', () => {
                    li.remove();
                    actualizarTotalesPresupuesto();
                }));
                qs('lista-materiales-presupuesto').appendChild(li);
            });
        }

        // Cargar servicios
        if (Array.isArray(p.servicios)) {
            p.servicios.forEach(ser => {
                const li = document.createElement('li');
                li.dataset.cantidad = ser.cantidad;
                li.dataset.precio   = ser.precio;
                li.textContent = ser.nombre;
                li.appendChild(crearBoton('<i class="fas fa-trash"></i>', 'btn-action', () => {
                    li.remove();
                    actualizarTotalesPresupuesto();
                }));
                qs('lista-servicios-presupuesto').appendChild(li);
            });
        }

        // Recalcular totales
        actualizarTotalesPresupuesto();
    }

    function abrirModal(htmlContenido) {
        if (!modalContenido || !modalPresupuesto) return;
        modalContenido.innerHTML = htmlContenido;
        modalPresupuesto.style.display = 'flex';
        // forzar reflow para que la transiciÃ³n funcione
        modalPresupuesto.offsetHeight;
        modalPresupuesto.style.opacity = '1';
        modalPresupuesto.style.pointerEvents = 'auto';
        document.body.style.overflow = 'hidden';
    }

    function cerrarModalFn() {
        if (!modalPresupuesto) return;
        modalPresupuesto.style.opacity = '0';
        modalPresupuesto.style.pointerEvents = 'none';
        setTimeout(() => {
            modalPresupuesto.style.display = 'none';
        }, 200);
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }

    function verPresupuesto(i) {
        const p = db.presupuestos[i];
        if (!p) return;
        abrirModal(p.html || '');
    }

    function eliminarPresupuesto(i) {
        if (!confirm('¿Eliminar este presupuesto?')) return;
        db.presupuestos.splice(i,1);
        renderListaPresupuestos(buscarPresupuesto.value);
    }

    // Cerrar con el botÃ³n Ã—
    if (cerrarModal) cerrarModal.addEventListener('click', cerrarModalFn);

    // Cerrar al hacer clic fuera del contenido
    if (modalPresupuesto) {
        modalPresupuesto.addEventListener('click', e => {
            if (e.target === modalPresupuesto) cerrarModalFn();
        });
    }

    // Cerrar con tecla Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') cerrarModalFn();
    });

    // Botones dentro del modal
    const modalBtnImprimir  = qs('modal-btn-imprimir');
    const modalBtnWhatsapp  = qs('modal-btn-whatsapp');
    if (modalBtnImprimir) modalBtnImprimir.addEventListener('click', imprimirPresupuesto);
    if (modalBtnWhatsapp) modalBtnWhatsapp.addEventListener('click', enviarPorWhatsApp);

    if (btnGuardarPresupuesto) {
        btnGuardarPresupuesto.addEventListener('click', () => {
            const datos = obtenerDatosPresupuesto();
            db.presupuestos.push(datos);
            guardarDatos();
            renderListaPresupuestos(buscarPresupuesto ? buscarPresupuesto.value : '');
            alert('Presupuesto guardado correctamente');
        });
    }

    if (buscarPresupuesto) {
        buscarPresupuesto.addEventListener('input', () => renderListaPresupuestos(buscarPresupuesto.value));
    }

    // Render inicial
    renderListaPresupuestos();

    //
})();

/********************  MENU HAMBURGUESA (ya existÃ­a)  ********************/
(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const menuHamburguesa = document.getElementById('menu-hamburguesa');
        const menu = document.getElementById('menu');
        const html = document.documentElement;
        if(!menuHamburguesa) return;
        menuHamburguesa.addEventListener('click', e => {
            e.stopPropagation();
            menu.classList.toggle('active');
            menuHamburguesa.classList.toggle('active');
            html.classList.toggle('menu-open');
        });
        document.addEventListener('click', (e)=>{
            if(!menu.contains(e.target) && !menuHamburguesa.contains(e.target)){
                menu.classList.remove('active');
                menuHamburguesa.classList.remove('active');
                html.classList.remove('menu-open');
            }
        });
    });
})();

// ======================
//  FIN DEL SCRIPT
// ======================

// Función para exportar datos a JSON
function exportarDatos() {
    try {
        const datosExportar = {
            clientes: db.clientes || [],
            materiales: db.materiales || [],
            servicios: db.servicios || [],
            presupuestos: db.presupuestos || [],
            fechaExportacion: new Date().toISOString(),
            version: '1.0'
        };
        
        const datosJSON = JSON.stringify(datosExportar, null, 2);
        const blob = new Blob([datosJSON], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `presupuestos_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('Datos exportados correctamente');
    } catch (error) {
        console.error('Error al exportar datos:', error);
        alert('Error al exportar los datos');
    }
}

// Función para importar datos desde JSON
function importarDatos() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const datosImportar = JSON.parse(e.target.result);
                
                // Validar estructura básica
                if (!datosImportar.version) {
                    throw new Error('Formato de archivo inválido');
                }
                
                // Confirmar importación
                const confirmar = confirm(`¿Importar ${datosImportar.clientes?.length || 0} clientes, ${datosImportar.materiales?.length || 0} materiales, ${datosImportar.servicios?.length || 0} servicios y ${datosImportar.presupuestos?.length || 0} presupuestos?\n\nEsta acción reemplazará todos los datos actuales.`);
                
                if (confirmar) {
                    // Importar datos
                    db.clientes = datosImportar.clientes || [];
                    db.materiales = datosImportar.materiales || [];
                    db.servicios = datosImportar.servicios || [];
                    db.presupuestos = datosImportar.presupuestos || [];
                    
                    // Guardar en localStorage
                    guardarDatos();
                    
                    // Actualizar interfaces
                    renderListaClientes();
                    renderListaMateriales();
                    renderListaServicios();
                    renderListaPresupuestos();
                    
                    alert('Datos importados correctamente');
                }
            } catch (error) {
                console.error('Error al importar datos:', error);
                alert('Error al importar los datos. Verifique que el archivo tenga el formato correcto.');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Event listeners para botones de exportar/importar
document.addEventListener('DOMContentLoaded', () => {
    const btnExportar = document.getElementById('exportar-datos');
    const btnImportar = document.getElementById('importar-datos');
    
    if (btnExportar) {
        btnExportar.addEventListener('click', (e) => {
            e.preventDefault();
            exportarDatos();
        });
    }
    
    if (btnImportar) {
        btnImportar.addEventListener('click', (e) => {
            e.preventDefault();
            importarDatos();
        });
    }
});
