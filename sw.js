/*
 * Service worker: guarda la "cáscara" de la app (HTML, CSS, JS, íconos y fuentes)
 * para que abra al instante y se pueda instalar.
 * Los datos (API de Apps Script) NUNCA se guardan aquí: siempre van a internet.
 *
 * v1.23 · "Primero lo guardado, y se actualiza por detrás" (stale-while-revalidate):
 *   - La app abre con lo que ya está en el celular, sin esperar a GitHub.
 *   - Por detrás, pregunta a GitHub si algún archivo cambió y guarda lo nuevo para la próxima vez.
 *   - Cuando cambias VERSION, el celular baja todo de nuevo (sin copias viejas) y la página
 *     se recarga sola una vez con la versión nueva (ver app.js, "controllerchange").
 *
 * Cuando cambies algún archivo de la web, sube el número de VERSION.
 */
const VERSION = 'agua-1.24';
const FUENTES = 'agua-fuentes';            // aparte: no se borra al cambiar de versión
const ARCHIVOS = [
  './', 'index.html', 'estilos.css', 'app.js', 'config.js', 'manifest.webmanifest',
  'iconos/icono-192.png', 'iconos/icono-512.png', 'iconos/favicon-32.png', 'iconos/logo-blanco.png'
];

self.addEventListener('install', evento => {
  // cache: 'reload' = bajar de GitHub sí o sí (sin la copia de 10 minutos del navegador)
  evento.waitUntil(
    caches.open(VERSION)
      .then(c => c.addAll(ARCHIVOS.map(u => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', evento => {
  evento.waitUntil(
    caches.keys()
      .then(claves => Promise.all(claves.filter(k => k !== VERSION && k !== FUENTES).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', evento => {
  const req = evento.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Fuentes de Google: los archivos de letra no cambian nunca → lo guardado primero.
  if (url.hostname === 'fonts.gstatic.com') {
    evento.respondWith(guardadoPrimero(req, FUENTES));
    return;
  }
  // La hoja de estilos de las fuentes: lo guardado y se revisa por detrás.
  if (url.hostname === 'fonts.googleapis.com') {
    evento.respondWith(guardadoYRevisar(evento, req, FUENTES));
    return;
  }
  if (url.origin !== self.location.origin) return;     // la API va directo a internet

  // La página: siempre la misma (index.html), venga con ?algo o no
  const clave = req.mode === 'navigate' ? 'index.html' : req;
  evento.respondWith(guardadoYRevisar(evento, req, VERSION, clave));
});

/** Responde con lo guardado; si no hay nada, va a internet y lo guarda. */
async function guardadoPrimero(req, nombreCache) {
  const cache = await caches.open(nombreCache);
  const guardado = await cache.match(req);
  if (guardado) return guardado;
  const resp = await fetch(req);
  if (resp.ok || resp.type === 'opaque') cache.put(req, resp.clone());
  return resp;
}

/** Responde con lo guardado al instante y, por detrás, trae lo nuevo de internet para la próxima vez. */
async function guardadoYRevisar(evento, req, nombreCache, clave) {
  const cache = await caches.open(nombreCache);
  const guardado = await cache.match(clave || req, { ignoreSearch: req.mode === 'navigate' });
  // cache: 'no-cache' = preguntarle a GitHub si cambió (responde rápido "304 sin cambios" si no)
  const deInternet = fetch(req, { cache: 'no-cache' })
    .then(resp => {
      if (resp.ok || resp.type === 'opaque') cache.put(clave || req, resp.clone());   // opaque: la hoja de Google Fonts
      return resp;
    });
  if (guardado) {
    evento.waitUntil(deInternet.catch(() => {}));       // que termine de actualizar aunque la página ya cargó
    return sinCacheDelNavegador(guardado);
  }
  // Sin señal y sin nada guardado: la página cae en index.html; un archivo suelto (o una fuente), en error limpio
  return deInternet.then(sinCacheDelNavegador)
    .catch(() => clave === 'index.html' ? cache.match('index.html') : Response.error());
}

/*
 * GitHub manda "Cache-Control: max-age=600". Si la respuesta llega así a la página, Chrome la
 * reutiliza hasta 10 minutos sin volver a preguntar (ni siquiera a este service worker).
 * Por eso se entrega con "no-cache": así cada apertura pasa por aquí.
 */
function sinCacheDelNavegador(resp) {
  if (!resp || !resp.ok || resp.type !== 'basic') return resp;
  const cabeceras = new Headers(resp.headers);
  cabeceras.set('Cache-Control', 'no-cache');
  return new Response(resp.body, { status: resp.status, statusText: resp.statusText, headers: cabeceras });
}
