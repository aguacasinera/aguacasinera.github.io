/* ============================================================
 *  AGUA CASINERA — lógica de la página (corre en el celular)
 * ============================================================
 *  Idea general:
 *   - "estado" guarda todo lo que la pantalla necesita.
 *   - Cada vez que algo cambia, llamamos a pintar() y se redibuja.
 *   - Para hablar con el servidor usamos api('nombreFuncion', ...),
 *     que hace un fetch() a Apps Script (CONFIG.API_URL en config.js).
 */

const estado = {
  token: leerToken(),
  datos: null,        // lo que devuelve inicio() en Codigo.gs
  vista: 'inicio',    // 'inicio' | 'directiva'
  editando: null,     // null | 'elegir' | 'motivo'
  motivo: '',
  ocupado: false,
  menu: false,
  pinNuevo: null,     // { nombre, pin } después de crear o reiniciar
  nombrarPendientes: false,
  nuevoNombre: '',    // lo que se está escribiendo en "Agregar miembro"
  nuevoCorreo: '',
  nombres: [],
  errorAcceso: '',
  instalar: null      // evento de Chrome para mostrar "Instalar app"
};

/* ---------- Íconos de línea (estilo Lucide, licencia ISC) ---------- */
const ICONOS = {
  olas: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  reloj: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  musica: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  lugar: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  campana: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  personas: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  enviar: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  copiar: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  salir: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  agregar: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/>',
  llave: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>',
  cancelar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="m14 14-4 4"/><path d="m10 14 4 4"/>',
  candado: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  descargar: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>'
};
function icono(nombre) {
  return '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true">' + ICONOS[nombre] + '</svg>';
}

/* ---------- Direcciones externas ---------- */
const URL_WHATSAPP = 'https://wa.me/?text=';
const URL_MAPAS = 'https://www.google.com/maps/search/?api=1&query=';

/* ---------- Utilidades ---------- */

/** Escapa texto antes de meterlo en el HTML (evita que un nombre o motivo rompa la página). */
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/**
 * Llama al servidor: await api('inicio', token)
 * Se envía como "text/plain" a propósito: así el navegador no hace la
 * consulta previa de CORS (preflight), que Apps Script no responde.
 */
async function api(accion, ...args) {
  let resp;
  try {
    resp = await fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ accion, args })
    });
  } catch (e) {
    throw new Error('Sin conexión. Revisa tu internet e inténtalo de nuevo.');
  }
  let r;
  try { r = await resp.json(); }
  catch (e) { throw new Error('El servidor no respondió bien. Inténtalo en un momento.'); }
  if (!r.ok) throw new Error(r.error);
  return r.datos;
}

function mensajeError(e) {
  return String((e && e.message) || e).replace(/^(Exception|Error):\s*/, '');
}

function leerToken() { try { return localStorage.getItem('ac_token'); } catch (e) { return null; } }
function guardarToken(t) { try { t ? localStorage.setItem('ac_token', t) : localStorage.removeItem('ac_token'); } catch (e) {} }

function aviso(texto) {
  const t = document.createElement('div');
  t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = texto;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

async function copiar(texto) {
  try { await navigator.clipboard.writeText(texto); }
  catch (e) { // dentro del iframe de Google a veces no hay permiso: plan B
    const area = document.createElement('textarea');
    area.value = texto; document.body.appendChild(area); area.select();
    document.execCommand('copy'); area.remove();
  }
  aviso('Copiado');
}

function tiempoRestante(iso) {
  const ms = new Date(iso) - Date.now();
  if (ms <= 0) return '';
  const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000);
  return h > 0 ? `Quedan ${h} h ${m} min` : `Quedan ${m} min`;
}

/* ---------- Arranque ---------- */

async function arrancar() {
  if (!estado.token) return mostrarAcceso();
  try {
    estado.datos = await api('inicio', estado.token);
    pintar();
  } catch (e) {
    if (mensajeError(e).includes('SESION')) return cerrarSesion();
    document.getElementById('app').innerHTML =
      `<header class="barra"><div class="marca"><span class="logo"><img src="iconos/logo-blanco.png" alt=""></span>Agua Casinera</div></header>
       <div class="aviso-error" role="alert">No se pudo cargar: ${esc(mensajeError(e))}</div>
       <button class="boton ancho" onclick="arrancar()">Reintentar</button>`;
  }
}

async function mostrarAcceso() {
  estado.datos = null;
  try { estado.nombres = await api('listarNombres'); } catch (e) { estado.errorAcceso = mensajeError(e); }
  pintarAcceso();
}

function cerrarSesion() {
  guardarToken(null);
  estado.token = null; estado.menu = false; estado.vista = 'inicio';
  mostrarAcceso();
}

/** Ejecuta una acción del servidor que devuelve inicio() y redibuja. */
async function accion(funcion, ...args) {
  if (estado.ocupado) return;
  estado.ocupado = true; pintar();
  try {
    const r = await api(funcion, estado.token, ...args);
    if (r && r.pin) {             // crear miembro o reiniciar PIN
      estado.pinNuevo = { nombre: r.nombre, pin: r.pin };
      if (!r.datos) { estado.ocupado = false; aviso('Tu PIN cambió. Vuelve a entrar con el nuevo.'); return; }
      estado.datos = r.datos;
    } else {
      estado.datos = r;
    }
    estado.editando = null;
    if (r && r.pin) estado.nuevoNombre = estado.nuevoCorreo = '';
  } catch (e) {
    if (mensajeError(e).includes('SESION')) { estado.ocupado = false; return cerrarSesion(); }
    aviso(mensajeError(e));
  }
  estado.ocupado = false;
  pintar();
  const caja = document.querySelector('.pin-nuevo');
  if (caja && estado.pinNuevo) caja.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ============================================================
 *  PANTALLA DE ACCESO
 * ============================================================ */

function pintarAcceso() {
  const opciones = estado.nombres.map(n => `<option value="${esc(n.id)}">${esc(n.nombre)}</option>`).join('');
  document.getElementById('app').innerHTML = `
    <section class="acceso">
      <div class="tarjeta ensayo">
        <img class="logo-grande" src="iconos/logo-blanco.png" alt="Logo de Agua Casinera">
        <p class="antetitulo">Grupo de baile</p>
        <h1>Agua Casinera</h1>
        <p style="position:relative;z-index:1;color:#d9d9de">Avisa si vas al ensayo, sin perderte en el chat.</p>
      </div>
      <form class="tarjeta" id="form-acceso" novalidate>
        <label class="campo" for="quien">¿Quién eres?</label>
        <select id="quien" required>
          <option value="">Elige tu nombre</option>${opciones}
        </select>
        <label class="campo" for="pin" style="margin-top:14px">Tu PIN
          <span class="ayuda">· 4 números que te dio la directiva</span></label>
        <input id="pin" class="pin" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="one-time-code" placeholder="••••">
        ${estado.errorAcceso ? `<div class="aviso-error" role="alert">${esc(estado.errorAcceso)}</div>` : ''}
        <button class="boton ancho" style="margin-top:16px" id="btn-entrar">${icono('candado')} Entrar</button>
        <p class="sub" style="margin-top:12px;text-align:center">¿No apareces o olvidaste tu PIN? Escríbele a la directiva.</p>
      </form>
      <div id="hueco-instalar">${bloqueInstalar()}</div>
    </section>`;

  document.getElementById('form-acceso').addEventListener('submit', async ev => {
    ev.preventDefault();
    const id = document.getElementById('quien').value;
    const pin = document.getElementById('pin').value.trim();
    if (!id || !/^\d{4}$/.test(pin)) { estado.errorAcceso = 'Elige tu nombre y escribe tu PIN de 4 números.'; return pintarAcceso(); }
    const btn = document.getElementById('btn-entrar');
    btn.disabled = true; btn.textContent = 'Entrando…';
    try {
      const datos = await api('entrar', id, pin);
      estado.token = datos.token; guardarToken(datos.token);
      estado.datos = datos; estado.errorAcceso = '';
      pintar();
    } catch (e) {
      estado.errorAcceso = mensajeError(e);
      pintarAcceso();
      document.getElementById('quien').value = id;
    }
  });
}

/* ============================================================
 *  PANTALLA PRINCIPAL
 * ============================================================ */

function pintar() {
  const d = estado.datos;
  if (!d) return;
  const esAdmin = !!d.admin;
  if (!esAdmin) estado.vista = 'inicio';

  document.getElementById('app').innerHTML = `
    <header class="barra">
      <div class="marca"><span class="logo"><img src="iconos/logo-blanco.png" alt=""></span>${esc(d.grupo)}</div>
      <button class="avatar" aria-label="Mi cuenta" aria-expanded="${String(estado.menu)}"
              onclick="estado.menu=!estado.menu;pintar()">${esc(d.yo.nombre.charAt(0).toUpperCase())}</button>
      ${estado.menu ? `<div class="menu">
          <p><strong>${esc(d.yo.nombre)}</strong>${d.yo.rol === 'admin' ? 'Directiva' : 'Miembro'}</p>
          ${estado.instalar ? `<button class="enlace" onclick="instalarApp()">${icono('descargar')} Instalar app</button><br>` : ''}
          <button class="enlace" onclick="cerrarSesion()">${icono('salir')} Cerrar sesión</button>
          <p class="version">Versión ${esc(CONFIG.VERSION)}</p>
        </div>` : ''}
    </header>
    ${esAdmin ? `<nav class="pestanas" role="tablist">
        <button role="tab" aria-selected="${String(estado.vista === 'inicio')}" onclick="estado.vista='inicio';pintar()">Inicio</button>
        <button role="tab" aria-selected="${String(estado.vista === 'directiva')}" onclick="estado.vista='directiva';pintar()">Directiva</button>
      </nav>` : ''}
    ${estado.vista === 'inicio' ? vistaInicio(d) : vistaDirectiva(d)}`;

  if (estado.editando === 'motivo') {
    const t = document.getElementById('motivo');
    if (t) { t.value = estado.motivo; t.focus(); }
  }
}

function tarjetaEnsayo(e) {
  return `
    <section class="tarjeta ensayo" aria-label="Próximo ensayo">
      <p class="antetitulo">Próximo ensayo</p>
      <h1>${esc(e.fechaTexto)}</h1>
      <div class="datos">
        <span class="dato">${icono('reloj')} ${esc(e.horario)}</span>
        ${e.social ? `<span class="dato">${icono('musica')} Social después · opcional</span>` : ''}
        ${e.lugar ? `<a class="dato" target="_blank" rel="noopener"
             href="${URL_MAPAS}${encodeURIComponent(e.lugar)}">${icono('lugar')} ${esc(e.lugar)}</a>` : ''}
      </div>
      ${e.estado === 'cancelado' ? `<div class="etiqueta-cancelado">${icono('cancelar')} Ensayo cancelado</div>
        ${e.nota ? `<p style="margin-top:8px;position:relative;z-index:1">${esc(e.nota)}</p>` : ''}` : ''}
    </section>`;
}

function bloquePlazo(e) {
  if (e.estado === 'cancelado' || e.empezo) return '';
  if (e.cerrado) {
    return `<div class="plazo cerrado">${icono('candado')}<div>
      <strong>El plazo para avisar ya cerró</strong>
      Si no puedes ir, avisa igual: quedará registrado como aviso tarde.</div></div>`;
  }
  if (e.esDiaCierre) {
    return `<div class="plazo urgente" role="alert">${icono('campana')}<div>
      <strong>Hoy ${esc(e.cierreDia)} es el último día para avisar si no vas</strong>
      <span id="cuenta">${esc(tiempoRestante(e.cierreISO))}</span>${tiempoRestante(e.cierreISO) ? ' · ' : ''}cierra a las 11:59&nbsp;p.&nbsp;m.</div></div>`;
  }
  return `<div class="plazo">${icono('campana')}<div>
    <strong>Puedes avisar hasta el ${esc(e.cierreTexto)}</strong>
    Si no vas, avísalo antes para organizar las parejas.</div></div>`;
}

function tarjetaRespuesta(d) {
  const e = d.ensayo, r = d.miRespuesta, ocupado = estado.ocupado ? 'disabled' : '';
  if (e.estado === 'cancelado') return '';

  // 1) Escribiendo el motivo de "no voy"
  if (estado.editando === 'motivo') {
    return `<section class="tarjeta">
      <h2>${icono('x')} No vas al ensayo</h2>
      <label class="campo" for="motivo">Motivo <span class="ayuda">· opcional, solo lo ve la directiva</span></label>
      <textarea id="motivo" maxlength="300" placeholder="Ej.: tengo turno en el trabajo"
                oninput="estado.motivo=this.value"></textarea>
      <div class="acciones">
        <button class="boton secundario" onclick="estado.editando=null;pintar()">Volver</button>
        <button class="boton oscuro" ${ocupado} onclick="accion('responder',{respuesta:'no_voy',motivo:estado.motivo})">
          ${icono('enviar')} Enviar aviso</button>
      </div></section>`;
  }

  // 2) Sin responder, o tocó "Cambiar"
  if (!r || estado.editando === 'elegir') {
    return `<section class="tarjeta">
      <h2>¿Vas a ir?</h2>
      <div class="eleccion">
        <button class="opcion voy" ${ocupado} onclick="accion('responder',{respuesta:'voy',social:''})">${icono('check')} Voy</button>
        <button class="opcion novoy" ${ocupado} onclick="estado.motivo='';estado.editando='motivo';pintar()">${icono('x')} No voy</button>
      </div>
      ${r ? `<button class="enlace" style="margin-top:10px" onclick="estado.editando=null;pintar()">Dejar mi respuesta como estaba</button>` : ''}
    </section>`;
  }

  // 3) Ya respondió
  const cambiar = `<button class="enlace" onclick="estado.editando='elegir';pintar()">Cambiar mi respuesta</button>`;
  if (r.respuesta === 'voy') {
    const chip = (valor, texto) => `<button class="chip" ${ocupado} aria-pressed="${String(r.social === valor)}"
        onclick="accion('responder',{respuesta:'voy',social:'${valor}'})">${r.social === valor ? icono('check') : ''}${texto}</button>`;
    return `<section class="tarjeta">
      <div class="estado voy"><span class="circulo">${icono('check')}</span>
        <div><strong>Vas al ensayo</strong><span class="sub">¡Nos vemos el ${esc(e.fechaTexto.split(' ')[0])}!</span></div></div>
      ${e.social ? `<p class="pregunta">¿Te quedas al social?</p>
        <div class="chips">${chip('si', 'Sí')}${chip('no', 'No')}${chip('quizas', 'Aún no sé')}</div>` : ''}
      <div style="margin-top:10px">${cambiar}</div></section>`;
  }
  return `<section class="tarjeta">
    <div class="estado novoy"><span class="circulo">${icono('x')}</span>
      <div><strong>Avisaste que no vas</strong>
      <span class="sub">${r.motivo ? 'Motivo: ' + esc(r.motivo) : 'Sin motivo'}</span>
      ${r.tarde ? ' <span class="insignia tarde">Aviso tarde</span>' : ''}</div></div>
    ${cambiar}</section>`;
}

function tarjetaResumen(s) {
  const pct = n => s.total ? (n / s.total * 100).toFixed(1) + '%' : '0';
  return `<section class="tarjeta">
    <h2>${icono('personas')} Cómo va el grupo</h2>
    <div class="barra-asistencia" role="img" aria-label="${s.voy} van, ${s.noVoy} no van, ${s.sinResponder} sin responder">
      <span class="b-voy" style="width:${pct(s.voy)}"></span><span class="b-novoy" style="width:${pct(s.noVoy)}"></span>
    </div>
    <div class="cifras">
      <div><b>${s.voy}</b><small>Van</small></div>
      <div><b>${s.noVoy}</b><small>No van</small></div>
      <div><b>${s.sinResponder}</b><small>Sin responder</small></div>
    </div></section>`;
}

function vistaInicio(d) {
  return tarjetaEnsayo(d.ensayo) + bloquePlazo(d.ensayo) + tarjetaRespuesta(d) +
    (d.ensayo.estado === 'cancelado' ? '' : tarjetaResumen(d.resumen));
}

/* ============================================================
 *  PESTAÑA DIRECTIVA
 * ============================================================ */

function textoWhatsApp(d) {
  const e = d.ensayo;
  let t = `Recuerda que tienes hasta hoy ${e.cierreDia} para avisar si no vas a asistir al ensayo del ${e.fechaTexto} (${e.horario}).`;
  if (estado.nombrarPendientes && d.admin.sinResponder.length) t += `\nAún no responden: ${d.admin.sinResponder.join(', ')}.`;
  return t + `\nResponde aquí: ${d.admin.url}`;
}

function vistaDirectiva(d) {
  const a = d.admin, e = d.ensayo, ocupado = estado.ocupado ? 'disabled' : '';
  const grupo = (titulo, ico, items, abierto, fila) => `
    <details ${abierto ? 'open' : ''}><summary>${icono(ico)} ${titulo}<span class="cuenta">${items.length}</span></summary>
      <ul class="lista">${items.length ? items.map(fila).join('') : '<li class="sub">Nadie por ahora</li>'}</ul></details>`;

  const pin = estado.pinNuevo ? `
    <div class="pin-nuevo" role="status">
      <strong>PIN de ${esc(estado.pinNuevo.nombre)}</strong>
      <div class="digitos">${esc(estado.pinNuevo.pin)}</div>
      <p class="sub">Envíaselo por privado. No se vuelve a mostrar.</p>
      <div class="acciones">
        <button class="boton" onclick="copiar(mensajePin())">${icono('copiar')} Copiar mensaje</button>
        <button class="boton secundario" onclick="estado.pinNuevo=null;pintar()">Listo</button>
      </div></div>` : '';

  return `
    ${pin}
    <section class="tarjeta">
      <h2>Respuestas · ${esc(e.fechaTexto)}</h2>
      ${grupo('Van', 'check', a.voy, true, m => `<li>${esc(m.nombre)}
          ${m.social === 'si' ? '<span class="insignia">Se queda al social</span>' : ''}
          ${m.social === 'quizas' ? '<span class="insignia">Social: quizás</span>' : ''}</li>`)}
      ${grupo('No van', 'x', a.noVoy, true, m => `<li>${esc(m.nombre)}
          ${m.tarde ? '<span class="insignia tarde">Aviso tarde</span>' : ''}
          ${m.motivo ? `<span class="motivo">${esc(m.motivo)}</span>` : ''}</li>`)}
      ${grupo('Sin responder', 'reloj', a.sinResponder, false, n => `<li>${esc(n)}</li>`)}
    </section>

    <section class="tarjeta">
      <h2>${icono('campana')} Recordatorio para el grupo</h2>
      ${e.esDiaCierre ? '' : '<p class="sub" style="margin-bottom:8px">Este mensaje está pensado para enviarse el día del cierre.</p>'}
      <div class="vista-previa">${esc(textoWhatsApp(d)).replace(/\n/g, '<br>')}</div>
      <label class="check"><input type="checkbox" ${estado.nombrarPendientes ? 'checked' : ''}
          onchange="estado.nombrarPendientes=this.checked;pintar()">
        <span>Mencionar a quienes no responden <span class="ayuda">· piensa si conviene nombrarlos frente a todos</span></span></label>
      <div class="acciones">
        <a class="boton" target="_blank" rel="noopener" href="${URL_WHATSAPP}${encodeURIComponent(textoWhatsApp(d))}">${icono('enviar')} Abrir WhatsApp</a>
        <button class="boton secundario" onclick="copiar(textoWhatsApp(estado.datos))">${icono('copiar')} Copiar</button>
      </div>
    </section>

    <section class="tarjeta">
      <h2>${icono('cancelar')} Este ensayo</h2>
      ${e.estado === 'cancelado'
        ? `<p class="sub">Está cancelado${e.nota ? ': ' + esc(e.nota) : ''}.</p>
           <div class="acciones"><button class="boton secundario" ${ocupado} onclick="accion('adminCancelarEnsayo',false,'')">Volver a programarlo</button></div>`
        : `<label class="campo" for="nota-cancelar">Motivo <span class="ayuda">· lo verán todos</span></label>
           <input type="text" id="nota-cancelar" maxlength="200" placeholder="Ej.: feriado, el local está cerrado">
           <div class="acciones"><button class="boton peligro" ${ocupado}
             onclick="accion('adminCancelarEnsayo',true,document.getElementById('nota-cancelar').value)">Cancelar el ensayo</button></div>`}
    </section>

    <section class="tarjeta">
      <h2>${icono('personas')} Miembros <span class="insignia">${a.miembros.filter(m => m.activo).length} activos</span></h2>
      <form id="form-miembro" class="formulario-fila" onsubmit="event.preventDefault();agregarMiembro()">
        <input type="text" id="nuevo-nombre" placeholder="Nombre y apellido" maxlength="60" aria-label="Nombre"
               value="${esc(estado.nuevoNombre)}" oninput="estado.nuevoNombre=this.value">
        <input type="email" id="nuevo-correo" placeholder="Correo (opcional, para el recordatorio)" aria-label="Correo"
               value="${esc(estado.nuevoCorreo)}" oninput="estado.nuevoCorreo=this.value">
        <button class="boton" ${ocupado}>${icono('agregar')} Agregar y generar PIN</button>
      </form>
      <div style="margin-top:12px">
        ${a.miembros.map(m => `
          <div class="miembro ${m.activo ? '' : 'apagado'}">
            <div class="info"><strong>${esc(m.nombre)}</strong>
              ${m.rol === 'admin' ? '<span class="insignia admin">Directiva</span>' : ''}
              ${m.activo ? '' : '<span class="insignia inactivo">Inactivo</span>'}
              <small>${m.correo ? esc(m.correo) : 'Sin correo'}</small></div>
            <button class="mini" ${ocupado} onclick="accion('adminReiniciarPin','${esc(m.id)}')" aria-label="Nuevo PIN para ${esc(m.nombre)}">${icono('llave')} PIN</button>
            ${m.id !== d.yo.id ? `<button class="mini" ${ocupado} onclick="accion('adminCambiarActivo','${esc(m.id)}',${!m.activo})">${m.activo ? 'Desactivar' : 'Activar'}</button>` : ''}
          </div>`).join('')}
      </div>
    </section>`;
}

function agregarMiembro() {
  accion('adminAgregarMiembro', estado.nuevoNombre, estado.nuevoCorreo);
}

function mensajePin() {
  const p = estado.pinNuevo;
  return `Hola ${p.nombre.split(' ')[0]}, esta es la app de Agua Casinera para avisar si vas a los ensayos: ${estado.datos.admin.url}\n` +
         `Elige tu nombre y entra con este PIN: ${p.pin}\nNo lo compartas con nadie.`;
}

/* ============================================================
 *  INSTALAR LA APP
 * ============================================================ */

const esIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const yaInstalada = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

/** Tarjeta de la pantalla de acceso: botón en Android, instrucciones en iPhone. */
function bloqueInstalar() {
  if (yaInstalada()) return '';
  if (estado.instalar) {
    return `<div class="tarjeta instalar">
      <div><strong>Instala la app</strong><span class="sub">Queda en tu pantalla de inicio, como cualquier app.</span></div>
      <button class="boton" onclick="instalarApp()">${icono('descargar')} Instalar</button></div>`;
  }
  if (esIOS) {
    return `<div class="tarjeta instalar"><div><strong>Instálala en tu iPhone</strong>
      <span class="sub">En Safari, toca Compartir y luego «Agregar a inicio».</span></div></div>`;
  }
  return '';
}

/** Chrome avisa que la app se puede instalar: guardamos el aviso para usarlo con nuestro botón. */
window.addEventListener('beforeinstallprompt', ev => {
  ev.preventDefault();
  estado.instalar = ev;
  refrescarInstalar();
});
window.addEventListener('appinstalled', () => { estado.instalar = null; aviso('¡Listo! Ya está en tu pantalla de inicio'); });

async function instalarApp() {
  if (!estado.instalar) return;
  estado.instalar.prompt();
  await estado.instalar.userChoice;
  estado.instalar = null; estado.menu = false;
  refrescarInstalar();
}

/** Muestra u oculta lo de instalar sin borrar lo que la persona está escribiendo. */
function refrescarInstalar() {
  const hueco = document.getElementById('hueco-instalar');
  if (hueco) hueco.innerHTML = bloqueInstalar();
  else if (estado.datos) pintar();
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}

/* Actualiza el "Quedan X h" cada minuto sin redibujar todo (para no borrar lo que escribes) */
setInterval(() => {
  const el = document.getElementById('cuenta');
  if (el && estado.datos) el.textContent = tiempoRestante(estado.datos.ensayo.cierreISO);
}, 60000);

arrancar();
