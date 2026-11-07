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
  editando: null,     // null | 'elegir' | 'llego_tarde' | 'no_voy'
  motivo: '',
  hora: '',           // "18:30" mientras se llena "Llego tarde"
  emergencia: false,
  ocupado: false,
  menu: false,
  pinNuevo: null,     // { nombre, pin } después de crear o reiniciar
  nombrarPendientes: false,
  nuevoNombre: '',    // lo que se está escribiendo en "Agregar miembro"
  nuevoCorreo: '',
  nombres: [],
  errorAcceso: '',
  instalar: null,     // evento de Chrome para mostrar "Instalar app"
  // Fase 2 · pasar lista
  lista: null,        // lo que devuelve listaAsistencia()
  cargandoLista: false,
  cambios: {},        // marcas tocadas que todavía no se guardan { idMiembro: estado }
  guardando: false,
  errorGuardar: false,
  temporizador: null,
  confirmarCierre: false,
  resumen: null       // lo que devuelve resumenAsistencia()
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
  reloj2: '<path d="M12 6v6h4"/><circle cx="12" cy="12" r="10"/>',
  lista: '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
  izq: '<path d="m15 18-6-6 6-6"/>',
  der: '<path d="m9 18 6-6-6-6"/>',
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
  estado.lista = null; estado.resumen = null; estado.cambios = {};
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
  const permisos = d.permisos || { lista: false, directiva: !!d.admin };
  const pestanas = [['inicio', 'Inicio']];
  if (permisos.lista) pestanas.push(['lista', 'Lista']);
  if (permisos.directiva && d.admin) pestanas.push(['directiva', 'Directiva']);
  if (!pestanas.some(p => p[0] === estado.vista)) estado.vista = 'inicio';
  const rolTexto = d.yo.rol === 'admin' ? 'Directiva' : (permisos.lista ? 'Talleres' : 'Miembro');

  document.getElementById('app').innerHTML = `
    <header class="barra">
      <div class="marca"><span class="logo"><img src="iconos/logo-blanco.png" alt=""></span>${esc(d.grupo)}</div>
      <button class="avatar" aria-label="Mi cuenta" aria-expanded="${String(estado.menu)}"
              onclick="estado.menu=!estado.menu;pintar()">${esc(d.yo.nombre.charAt(0).toUpperCase())}</button>
      ${estado.menu ? `<div class="menu">
          <p><strong>${esc(d.yo.nombre)}</strong>${rolTexto}</p>
          ${estado.instalar ? `<button class="enlace" onclick="instalarApp()">${icono('descargar')} Instalar app</button><br>` : ''}
          <button class="enlace" onclick="cerrarSesion()">${icono('salir')} Cerrar sesión</button>
          <p class="version">Versión ${esc(CONFIG.VERSION)}</p>
        </div>` : ''}
    </header>
    ${pestanas.length > 1 ? `<nav class="pestanas" role="tablist">
        ${pestanas.map(([id, texto]) => `<button role="tab" aria-selected="${String(estado.vista === id)}"
            onclick="irA('${id}')">${texto}</button>`).join('')}
      </nav>` : ''}
    ${estado.vista === 'lista' ? vistaLista() : estado.vista === 'directiva' ? vistaDirectiva(d) : vistaInicio(d)}`;

  if (estado.editando === 'llego_tarde' && !estado.hora) document.getElementById('hora')?.focus();
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
      <strong>El plazo para avisar cerró el ${esc(e.cierreDia)}</strong>
      Desde ahora, un aviso de tardanza o falta cuenta como <b>injustificado</b>, salvo una emergencia real (la directiva decide).</div></div>`;
  }
  if (e.esDiaCierre) {
    return `<div class="plazo urgente" role="alert">${icono('campana')}<div>
      <strong>Hoy ${esc(e.cierreDia)} vence el plazo para avisar tardanza o falta</strong>
      <span id="cuenta">${esc(tiempoRestante(e.cierreISO))}</span>${tiempoRestante(e.cierreISO) ? ' · ' : ''}cierra a las 11:59&nbsp;p.&nbsp;m.</div></div>`;
  }
  return `<div class="plazo">${icono('campana')}<div>
    <strong>Avisa tardanza o falta hasta el ${esc(e.cierreTexto)}</strong>
    Después cuenta como injustificada: tardanza S/&nbsp;5, falta S/&nbsp;15.</div></div>`;
}

/** Fecha y hora de Lima legibles: "vie 6 nov, 10:32 p. m." (Perú no cambia de hora: UTC−5). */
function cuando(iso) {
  const d = new Date(new Date(iso).getTime() - 5 * 3600 * 1000);
  if (isNaN(d)) return '';
  const dias = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic'];
  const h = d.getUTCHours(), m = String(d.getUTCMinutes()).padStart(2, '0');
  return `${dias[d.getUTCDay()]} ${d.getUTCDate()} ${meses[d.getUTCMonth()]}, ${(h % 12) || 12}:${m} ${h < 12 ? 'a. m.' : 'p. m.'}`;
}

/** Texto para dejar el aviso también en WhatsApp ("mensajes importantes"). */
function mensajeAviso(d) {
  const r = d.miRespuesta, e = d.ensayo;
  const que = r.respuesta === 'llego_tarde' ? `llegaré a las ${r.horaTexto.replace(/ /g, ' ')}` : 'no asistiré';
  return `${r.emergencia ? '🚨 EMERGENCIA · ' : '📌 '}Aviso para el ensayo del ${e.fechaTexto}\n` +
         `${d.yo.nombre}: ${que}${que.endsWith('.') ? '' : '.'}` + (r.motivo ? `\nMotivo: ${r.motivo}` : '') +
         `\n(Registrado en la app: ${cuando(r.actualizado)})`;
}

/** Insignia del aviso: a tiempo, fuera de plazo o emergencia (y lo que decidió la directiva). */
function insigniaAviso(r) {
  if (r.emergencia) {
    const t = { '': 'Emergencia · por decidir', aceptada: 'Emergencia · justificada', rechazada: 'Emergencia · no justificada' }[r.decision || ''];
    return `<span class="insignia ${r.decision === 'rechazada' ? 'sin-aviso' : r.decision === 'aceptada' ? 'ok' : 'tarde'}">${t}</span>`;
  }
  if (r.tarde) return `<span class="insignia sin-aviso">Fuera de plazo · injustificado</span>`;
  return `<span class="insignia ok">A tiempo</span>`;
}

/** Formulario de "Llego tarde" o "No voy". Después del cierre ofrece marcarlo como emergencia. */
function formularioAviso(d, tipo) {
  const e = d.ensayo, ocupado = estado.ocupado ? 'disabled' : '';
  const tarde = tipo === 'llego_tarde';
  const necesitaMotivo = e.cerrado && estado.emergencia;
  return `<section class="tarjeta">
    <h2>${icono(tarde ? 'reloj2' : 'x')} ${tarde ? 'Llegarás tarde' : 'No vas al ensayo'}</h2>
    ${tarde ? `<label class="campo" for="hora">¿A qué hora llegarás? <span class="ayuda">· la llegada general es a las ${esc(e.horario.split(' a ')[0])}</span></label>
      <input type="time" id="hora" min="${esc(e.inicio)}" step="300" value="${esc(estado.hora)}" oninput="estado.hora=this.value"
             style="max-width:180px;margin-bottom:12px">` : ''}
    <label class="campo" for="motivo">Motivo <span class="ayuda">· ${necesitaMotivo ? 'obligatorio para una emergencia' : 'opcional'}; solo lo ve la directiva</span></label>
    <textarea id="motivo" maxlength="300" placeholder="${tarde ? 'Ej.: salgo del trabajo a las 6' : 'Ej.: tengo turno en el trabajo'}"
              oninput="estado.motivo=this.value">${esc(estado.motivo)}</textarea>
    ${e.cerrado ? `
      <div class="aviso-plazo">
        <p><strong>El plazo cerró el ${esc(e.cierreDia)}.</strong> Este aviso queda registrado, pero cuenta como
        <b>${tarde ? 'tardanza' : 'falta'} injustificada (S/&nbsp;${tarde ? 5 : 15})</b>${tarde ? ' si llegas después de la llegada general' : ''}.</p>
        <label class="check"><input type="checkbox" ${estado.emergencia ? 'checked' : ''}
            onchange="estado.emergencia=this.checked;pintar()">
          <span>Es una <b>emergencia real</b> <span class="ayuda">· la directiva revisará tu motivo y decidirá si la justifica</span></span></label>
      </div>` : ''}
    <div class="acciones">
      <button class="boton secundario" onclick="estado.editando=null;pintar()">Volver</button>
      <button class="boton oscuro" ${ocupado} onclick="enviarAviso('${tipo}')">${icono('enviar')} Enviar aviso</button>
    </div></section>`;
}

function enviarAviso(tipo) {
  const e = estado.datos.ensayo;
  if (tipo === 'llego_tarde' && !estado.hora) return aviso('Elige a qué hora llegarás.');
  if (e.cerrado && estado.emergencia && estado.motivo.trim().length < 5) return aviso('Cuenta brevemente cuál es la emergencia.');
  accion('responder', { respuesta: tipo, motivo: estado.motivo, horaLlegada: tipo === 'llego_tarde' ? estado.hora : '',
                        emergencia: !!(e.cerrado && estado.emergencia) });
}

/** Abre el formulario con lo que la persona ya había avisado (para corregirlo sin reescribir todo). */
function abrirAviso(tipo) {
  const r = estado.datos.miRespuesta;
  const mismo = r && r.respuesta === tipo;
  estado.motivo = mismo ? r.motivo : '';
  estado.hora = mismo && r.horaLlegada ? r.horaLlegada : (estado.hora || '');
  estado.emergencia = mismo ? r.emergencia : false;
  estado.editando = tipo;
  pintar();
}

function tarjetaRespuesta(d) {
  const e = d.ensayo, r = d.miRespuesta, ocupado = estado.ocupado ? 'disabled' : '';
  if (e.estado === 'cancelado') return '';

  // 1) Llenando "Llego tarde" o "No voy"
  if (estado.editando === 'llego_tarde' || estado.editando === 'no_voy') return formularioAviso(d, estado.editando);

  // 2) Sin responder, o tocó "Cambiar"
  if (!r || estado.editando === 'elegir') {
    return `<section class="tarjeta">
      <h2>¿Vas a ir?</h2>
      <div class="eleccion tres">
        <button class="opcion voy" ${ocupado} onclick="accion('responder',{respuesta:'voy',social:''})">${icono('check')} Voy</button>
        <button class="opcion llegotarde" ${ocupado} onclick="abrirAviso('llego_tarde')">${icono('reloj2')} Llego tarde</button>
        <button class="opcion novoy" ${ocupado} onclick="abrirAviso('no_voy')">${icono('x')} No voy</button>
      </div>
      ${r ? `<button class="enlace" style="margin-top:10px" onclick="estado.editando=null;pintar()">Dejar mi respuesta como estaba</button>` : ''}
    </section>`;
  }

  // 3) Ya respondió
  const cambiar = `<button class="enlace" onclick="estado.editando='elegir';pintar()">Cambiar mi respuesta</button>`;
  const chip = (valor, texto) => `<button class="chip" ${ocupado} aria-pressed="${String(r.social === valor)}"
      onclick="accion('responder',{respuesta:'${r.respuesta}',social:'${valor}',motivo:estado.datos.miRespuesta.motivo,horaLlegada:'${esc(r.horaLlegada || '')}'})">${r.social === valor ? icono('check') : ''}${texto}</button>`;
  const social = e.social ? `<p class="pregunta">¿Te quedas al social?</p>
      <div class="chips">${chip('si', 'Sí')}${chip('no', 'No')}${chip('quizas', 'Aún no sé')}</div>` : '';
  const whatsapp = `<div class="dejar-wa">
      <p class="sub">Para que quede también en <b>mensajes importantes</b> de WhatsApp:</p>
      <div class="acciones">
        <a class="boton secundario" target="_blank" rel="noopener" href="${URL_WHATSAPP}${encodeURIComponent(mensajeAviso(d))}">${icono('enviar')} Abrir WhatsApp</a>
        <button class="boton secundario" onclick="copiar(mensajeAviso(estado.datos))">${icono('copiar')} Copiar</button>
      </div></div>`;

  if (r.respuesta === 'voy') {
    return `<section class="tarjeta">
      <div class="estado voy"><span class="circulo">${icono('check')}</span>
        <div><strong>Vas al ensayo</strong><span class="sub">Llegada: ${esc(e.horario.split(' a ')[0])}. ¡Nos vemos!</span></div></div>
      ${social}<div style="margin-top:10px">${cambiar}</div></section>`;
  }
  if (r.respuesta === 'llego_tarde') {
    return `<section class="tarjeta">
      <div class="estado llegotarde"><span class="circulo">${icono('reloj2')}</span>
        <div><strong>Llegas a las ${esc(r.horaTexto)}</strong>
        <span class="sub">${r.motivo ? 'Motivo: ' + esc(r.motivo) : 'Sin motivo'}</span>
        ${insigniaAviso(r)}</div></div>
      <p class="sub">Si llegas después de esa hora, cuenta como tardanza.</p>
      ${social}${whatsapp}<div style="margin-top:6px">${cambiar}</div></section>`;
  }
  return `<section class="tarjeta">
    <div class="estado novoy"><span class="circulo">${icono('x')}</span>
      <div><strong>Avisaste que no vas</strong>
      <span class="sub">${r.motivo ? 'Motivo: ' + esc(r.motivo) : 'Sin motivo'}</span>
      ${insigniaAviso(r)}</div></div>
    ${whatsapp}<div style="margin-top:6px">${cambiar}</div></section>`;
}

function tarjetaResumen(s) {
  const pct = n => s.total ? (n / s.total * 100).toFixed(1) + '%' : '0';
  return `<section class="tarjeta">
    <h2>${icono('personas')} Cómo va el grupo</h2>
    <div class="barra-asistencia" role="img" aria-label="${s.voy} van, ${s.llegaTarde} llegan tarde, ${s.noVoy} no van, ${s.sinResponder} sin responder">
      <span class="b-voy" style="width:${pct(s.voy)}"></span><span class="b-tarde" style="width:${pct(s.llegaTarde)}"></span><span class="b-novoy" style="width:${pct(s.noVoy)}"></span>
    </div>
    <div class="cifras cuatro">
      <div><b>${s.voy}</b><small>Van</small></div>
      <div><b>${s.llegaTarde}</b><small>Llegan tarde</small></div>
      <div><b>${s.noVoy}</b><small>No van</small></div>
      <div><b>${s.sinResponder}</b><small>Sin responder</small></div>
    </div></section>`;
}

function vistaInicio(d) {
  return tarjetaEnsayo(d.ensayo) + bloquePlazo(d.ensayo) + tarjetaRespuesta(d) +
    (d.ensayo.estado === 'cancelado' ? '' : tarjetaResumen(d.resumen)) + tarjetaMiAsistencia(d.miAsistencia);
}

/** Cambia de pestaña. La lista y el resumen se piden recién la primera vez que se abren. */
async function irA(vista) {
  if (estado.vista === 'lista' && vista !== 'lista') await guardarCambios();
  estado.vista = vista; estado.menu = false;
  pintar();
  if (vista === 'lista' && !estado.lista) { cargarLista(); cargarResumen(); }
}

/* ============================================================
 *  FASE 2 · MI ASISTENCIA (todos) y PASAR LISTA (directiva y Talleres)
 * ============================================================ */

const ESTADOS = {
  presente: { texto: 'Presente', corto: 'Presente', icono: 'check' },
  tarde:    { texto: 'Llegó tarde', corto: 'Tarde', icono: 'reloj2' },
  falta:    { texto: 'Faltó', corto: 'Falta', icono: 'x' }
};

function tarjetaMiAsistencia(m) {
  if (!m || !m.ultimos || !m.ultimos.length) return '';
  return `<section class="tarjeta">
    <h2>${icono('lista')} Mi asistencia</h2>
    ${m.total ? `<p class="mi-cifra"><b>${m.asistidos}</b> de ${m.total} ensayos en ${esc(m.mesTexto)}</p>` : ''}
    <ul class="historial">${m.ultimos.map(u => `
      <li class="h-${esc(u.estado)}" title="${esc(u.texto)}">${icono(ESTADOS[u.estado].icono)}<span>${esc(u.fecha)}</span>
        <small>${ESTADOS[u.estado].corto}</small>${u.monto ? `<em>S/ ${u.monto}</em>` : u.porDecidir ? '<em class="pend">Por decidir</em>' : ''}</li>`).join('')}
    </ul>
    ${m.penalidadMes ? `<p class="penalidad-mes"><b>Penalidades de ${esc(m.mesTexto)}: S/ ${m.penalidadMes}</b><br>
      <span class="sub">Págalas a Tesorería. Tardanza S/ 5 y falta S/ 15, solo cuando no son justificadas.</span></p>` : ''}
    </section>`;
}

async function cargarLista(fecha) {
  await guardarCambios();
  estado.cargandoLista = true; estado.confirmarCierre = false; pintar();
  try { estado.lista = await api('listaAsistencia', estado.token, fecha || ''); }
  catch (e) { if (mensajeError(e).includes('SESION')) return cerrarSesion(); aviso(mensajeError(e)); }
  estado.cargandoLista = false; pintar();
}

async function cargarResumen(mes) {
  try { estado.resumen = await api('resumenAsistencia', estado.token, mes || ''); pintar(); }
  catch (e) { aviso(mensajeError(e)); }
}

/** Tocar un estado: cambia en pantalla al instante y se guarda solo, juntando varios toques. */
function marcar(id, valor) {
  const p = estado.lista.personas.find(x => x.id === id);
  p.asistencia = p.asistencia === valor ? '' : valor;   // tocar el mismo otra vez lo borra
  p.incidencia = null;                                  // la penalidad la recalcula el servidor al guardar
  estado.cambios[id] = p.asistencia;
  programarGuardado();
  pintar();
}

function marcarVarios(filtro, valor) {
  estado.lista.personas.filter(filtro).forEach(p => { p.asistencia = valor; p.incidencia = null; estado.cambios[p.id] = valor; });
  estado.confirmarCierre = false;
  programarGuardado();
  pintar();
}

function programarGuardado() {
  clearTimeout(estado.temporizador);
  estado.temporizador = setTimeout(guardarCambios, 1200);
}

async function guardarCambios() {
  clearTimeout(estado.temporizador);
  if (estado.guardando || !estado.lista || !Object.keys(estado.cambios).length) return;
  const lote = estado.cambios, ensayoId = estado.lista.ensayoId;
  estado.cambios = {}; estado.guardando = true; estado.errorGuardar = false; pintarEstadoGuardado();
  try {
    mezclarLista(await api('guardarAsistencia', estado.token, ensayoId, lote));
    cargarResumen(estado.resumenMes);  // el resumen cambió: se vuelve a pedir
  } catch (e) {
    estado.cambios = Object.assign(lote, estado.cambios);   // no se pierde nada: se reintenta
    estado.errorGuardar = true;
    aviso('No se pudo guardar: ' + mensajeError(e));
  }
  estado.guardando = false;
  if (estado.vista === 'lista') pintar(); else pintarEstadoGuardado();
  if (Object.keys(estado.cambios).length && !estado.errorGuardar) programarGuardado();
}

/**
 * El servidor devuelve la lista con las penalidades recalculadas. Si mientras tanto se tocaron
 * otras personas, se respeta lo tocado en pantalla (todavía no se guardó).
 */
function mezclarLista(nueva) {
  if (estado.lista && nueva.ensayoId === estado.lista.ensayoId) {
    nueva.personas.forEach(p => {
      if (!(p.id in estado.cambios)) return;
      const local = estado.lista.personas.find(x => x.id === p.id);
      if (local) { p.asistencia = local.asistencia; p.incidencia = null; }
    });
  }
  estado.lista = nueva;
}

/** La directiva justifica (o no) una emergencia avisada fuera de plazo. */
async function decidir(id, decision) {
  await guardarCambios();
  try {
    mezclarLista(await api('decidirEmergencia', estado.token, estado.lista.ensayoId, id, decision));
    cargarResumen(estado.resumenMes);
  } catch (e) { aviso(mensajeError(e)); }
  pintar();
}

/** Solo actualiza el texto "Guardando… / Guardado" (sin redibujar toda la lista). */
function pintarEstadoGuardado() {
  const el = document.getElementById('estado-guardado');
  if (el) el.outerHTML = textoGuardado();
}
function textoGuardado() {
  const pendientes = Object.keys(estado.cambios).length;
  if (estado.guardando) return `<span id="estado-guardado" class="guardado ocupado">Guardando…</span>`;
  if (estado.errorGuardar) return `<button id="estado-guardado" class="guardado error" onclick="estado.errorGuardar=false;guardarCambios()">Sin guardar · Reintentar</button>`;
  if (pendientes) return `<span id="estado-guardado" class="guardado ocupado">Guardando…</span>`;
  return `<span id="estado-guardado" class="guardado ok">${icono('check')} Guardado</span>`;
}

window.addEventListener('beforeunload', ev => {
  if (Object.keys(estado.cambios).length || estado.guardando) { ev.preventDefault(); ev.returnValue = ''; }
});

function vistaLista() {
  const l = estado.lista;
  if (!l || estado.cargandoLista) return `<div class="cargando"><span class="ola"></span>Cargando la lista…</div>`;
  const ps = l.personas;
  const cuenta = v => ps.filter(p => p.asistencia === v).length;
  const sinMarcar = ps.filter(p => !p.asistencia);
  const voySinMarcar = sinMarcar.filter(p => p.respuesta === 'voy');

  const fuera = p => p.emergencia ? '' : p.avisoTarde ? ' · <b>fuera de plazo</b>' : '';
  const nota = p => {
    let t;
    if (p.respuesta === 'voy') t = `<span class="nota voy">${icono('check')} Dijo que va</span>`;
    else if (p.respuesta === 'llego_tarde') t = `<span class="nota llegotarde">${icono('reloj2')} Avisó que llega a las ${esc(p.horaAvisada)}${fuera(p)}</span>`;
    else if (p.respuesta === 'no_voy') t = `<span class="nota novoy">${icono('x')} Avisó que no va${fuera(p)}</span>`;
    else t = `<span class="nota">No respondió</span>`;
    if (p.horaEsperada !== l.horaGeneral) t += `<span class="nota esperada">Se le espera a las ${esc(p.horaEsperada)}</span>`;
    if (p.motivo && !p.emergencia) t += `<span class="nota motivo">${esc(p.motivo)}</span>`;
    return t;
  };
  // Emergencia avisada fuera de plazo: la directiva decide; Talleres solo la ve
  const emergencia = p => !p.emergencia ? '' : `
    <div class="emergencia">
      <p><strong>Emergencia</strong> · ${esc(p.motivo)}</p>
      ${l.puedeDecidir ? `<div class="decidir">
          <button class="mini" aria-pressed="${String(p.decision === 'aceptada')}" onclick="decidir('${esc(p.id)}', ${p.decision === 'aceptada' ? "''" : "'aceptada'"})">${icono('check')} Justificar</button>
          <button class="mini" aria-pressed="${String(p.decision === 'rechazada')}" onclick="decidir('${esc(p.id)}', ${p.decision === 'rechazada' ? "''" : "'rechazada'"})">${icono('x')} No justificar</button>
        </div>`
      : `<p class="sub">${p.decision === 'aceptada' ? 'Justificada por la directiva' : p.decision === 'rechazada' ? 'No justificada por la directiva' : 'La directiva todavía no decide'}</p>`}
    </div>`;
  // Resultado de la marca: penalidad o justificación (lo calcula el servidor al guardar)
  const resultado = p => {
    if (!p.asistencia || p.asistencia === 'presente') return '';
    if (!p.incidencia) return `<span class="resultado pend">Calculando…</span>`;
    const i = p.incidencia;
    if (i.monto) return `<span class="resultado multa">S/ ${i.monto} · ${esc(i.texto)}</span>`;
    return `<span class="resultado ${i.tipo === 'por_decidir' ? 'pend' : 'ok'}">${esc(i.texto)}</span>`;
  };
  const totalPenalidades = ps.reduce((t, p) => t + (p.incidencia ? p.incidencia.monto : 0), 0);
  const botones = p => Object.keys(ESTADOS).map(v => `
      <button class="marca-${v}" aria-pressed="${String(p.asistencia === v)}"
              aria-label="${esc(p.nombre)}: ${ESTADOS[v].texto}" onclick="marcar('${esc(p.id)}','${v}')">
        ${icono(ESTADOS[v].icono)}<span>${ESTADOS[v].corto}</span></button>`).join('');

  return `
    <section class="tarjeta">
      <div class="lista-cabecera">
        <h2>${icono('lista')} Pasar lista</h2>
        ${textoGuardado()}
      </div>
      <label class="campo" for="fecha-lista">Ensayo</label>
      <select id="fecha-lista" onchange="cargarLista(this.value)">
        ${l.fechas.map(f => `<option value="${esc(f.fecha)}" ${f.fecha === l.fecha ? 'selected' : ''}>${esc(f.texto)}</option>`).join('')}
      </select>
      ${l.cancelado ? `<p class="aviso-error" style="margin-top:12px">Este ensayo fue cancelado${l.nota ? ': ' + esc(l.nota) : ''}. No se pasa lista.</p>` : `
      <div class="cifras cuatro" style="margin-top:14px">
        <div><b>${cuenta('presente')}</b><small>Presentes</small></div>
        <div><b>${cuenta('tarde')}</b><small>Tarde</small></div>
        <div><b>${cuenta('falta')}</b><small>Faltas</small></div>
        <div><b>${sinMarcar.length}</b><small>Sin marcar</small></div>
      </div>
      <p class="sub" style="margin-top:10px">Llegada general: <b>${esc(l.horaGeneral)}</b> · Penalidades de este ensayo: <b>S/ ${totalPenalidades}</b></p>
      ${voySinMarcar.length ? `<button class="boton secundario ancho" style="margin-top:12px"
          onclick="marcarVarios(p => !p.asistencia && p.respuesta === 'voy', 'presente')">
          ${icono('check')} Marcar presentes a quienes dijeron que van (${voySinMarcar.length})</button>` : ''}`}
    </section>
    ${l.cancelado ? '' : `
    <section class="tarjeta lista-personas">
      ${ps.map(p => `
        <div class="persona ${p.asistencia ? 'p-' + p.asistencia : ''}">
          <div class="persona-info"><strong>${esc(p.nombre)}</strong>${nota(p)}</div>
          ${emergencia(p)}
          <div class="marcas" role="group" aria-label="Asistencia de ${esc(p.nombre)}">${botones(p)}</div>
          ${resultado(p)}
        </div>`).join('')}
    </section>
    ${sinMarcar.length ? `<section class="tarjeta">
      ${estado.confirmarCierre
        ? `<p><strong>¿Marcar falta a ${sinMarcar.length} ${sinMarcar.length === 1 ? 'persona' : 'personas'}?</strong></p>
           <p class="sub">${esc(sinMarcar.map(p => p.nombre).join(', '))}</p>
           <div class="acciones">
             <button class="boton secundario" onclick="estado.confirmarCierre=false;pintar()">Volver</button>
             <button class="boton oscuro" onclick="marcarVarios(p => !p.asistencia, 'falta')">Sí, marcar falta</button>
           </div>`
        : `<button class="boton oscuro ancho" onclick="estado.confirmarCierre=true;pintar()">
             Terminar lista: falta a quienes no marcaste (${sinMarcar.length})</button>`}
    </section>` : ''}`}
    ${tarjetaResumenMes()}`;
}

function tarjetaResumenMes() {
  const r = estado.resumen;
  if (!r) return `<section class="tarjeta"><h2>Resumen del mes</h2><p class="sub">Cargando…</p></section>`;
  estado.resumenMes = r.mes;
  const filas = r.personas.slice().sort((a, b) =>
    (a.porcentaje ?? 101) - (b.porcentaje ?? 101) || a.nombre.localeCompare(b.nombre, 'es'));
  const detalle = p => [
    p.tarde ? `${p.tarde} tardanza${p.tarde > 1 ? 's' : ''}` : '',
    p.faltaJustificada ? `${p.faltaJustificada} falta${p.faltaJustificada > 1 ? 's' : ''} justificada${p.faltaJustificada > 1 ? 's' : ''}` : '',
    p.faltaInjustificada ? `<span class="insignia sin-aviso">${p.faltaInjustificada} injustificada${p.faltaInjustificada > 1 ? 's' : ''}</span>` : '',
    p.porDecidir ? `<span class="insignia tarde">${p.porDecidir} por decidir</span>` : '',
    p.penalidad ? `<b class="multa-texto">S/ ${p.penalidad}</b>` : ''
  ].filter(Boolean).join(' · ');
  return `<section class="tarjeta">
    <div class="mes-nav">
      <button class="mini" aria-label="Mes anterior" onclick="cargarResumen('${r.anterior}')">${icono('izq')}</button>
      <h2>${esc(r.mesTexto)}</h2>
      ${r.siguiente ? `<button class="mini" aria-label="Mes siguiente" onclick="cargarResumen('${r.siguiente}')">${icono('der')}</button>` : '<span style="width:38px"></span>'}
    </div>
    ${!r.ensayos ? `<p class="sub">Todavía no hay ensayos con lista este mes.</p>` : `
    <p class="sub" style="margin-bottom:8px;text-align:center">Resumen · ${r.ensayos} ${r.ensayos === 1 ? 'ensayo' : 'ensayos'} con lista<br>De menor a mayor asistencia</p>
    <p class="total-penalidades">Penalidades del mes: <b>S/ ${r.penalidadTotal}</b></p>
    <ul class="resumen-lista">${filas.map(p => `
      <li>
        <div class="r-fila"><strong>${esc(p.nombre)}</strong>
          <span class="r-pct">${p.porcentaje === null ? '—' : p.porcentaje + '%'}</span></div>
        <div class="r-barra" role="img" aria-label="${p.porcentaje === null ? 'sin datos' : p.porcentaje + '% de asistencia'}">
          <span style="width:${p.porcentaje || 0}%"></span></div>
        ${detalle(p) ? `<div class="r-detalle">${detalle(p)}</div>` : ''}
      </li>`).join('')}
    </ul>`}
  </section>`;
}

/* ============================================================
 *  PESTAÑA DIRECTIVA
 * ============================================================ */

function textoWhatsApp(d) {
  const e = d.ensayo;
  const llegada = e.horario.split(' a ')[0].replace(/\u00a0/g, ' ');
  let t = `Recuerda que tienes hasta hoy ${e.cierreDia} a las 11:59 p. m. para avisar si llegarás tarde o no asistirás ` +
          `al ensayo del ${e.fechaTexto} (llegada ${llegada}). Después se considera falta o tardanza injustificada.`;
  if (estado.nombrarPendientes && d.admin.sinResponder.length) t += `\nAún no responden: ${d.admin.sinResponder.join(', ')}.`;
  return t + `\nAvisa aquí: ${d.admin.url}`;
}

/** Insignia corta para la directiva: solo se muestra si el aviso NO fue a tiempo. */
function insigniaAvisoCorta(m) {
  if (m.emergencia) return ` <span class="insignia tarde">Emergencia${m.decision === 'aceptada' ? ' · justificada' : m.decision === 'rechazada' ? ' · no justificada' : ' · por decidir'}</span>`;
  return m.tarde ? ' <span class="insignia sin-aviso">Fuera de plazo</span>' : '';
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
      ${grupo('Llegan tarde', 'reloj2', a.llegaTarde || [], true, m => `<li>${esc(m.nombre)}
          <span class="insignia">${esc(m.hora)}</span>${insigniaAvisoCorta(m)}
          ${m.motivo ? `<span class="motivo">${esc(m.motivo)}</span>` : ''}</li>`)}
      ${grupo('No van', 'x', a.noVoy, true, m => `<li>${esc(m.nombre)}${insigniaAvisoCorta(m)}
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
  // updateViaCache: 'none' = el celular revisa si hay un service worker nuevo sin usar copias guardadas
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).catch(() => {}));
}

/* Actualiza el "Quedan X h" cada minuto sin redibujar todo (para no borrar lo que escribes) */
setInterval(() => {
  const el = document.getElementById('cuenta');
  if (el && estado.datos) el.textContent = tiempoRestante(estado.datos.ensayo.cierreISO);
}, 60000);

arrancar();
