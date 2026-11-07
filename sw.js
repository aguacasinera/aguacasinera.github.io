/*
 * Service worker: guarda la "cáscara" de la app (HTML, CSS, JS, íconos)
 * para que abra rápido y se pueda instalar.
 * Los datos (API de Apps Script) NUNCA se guardan aquí: siempre van a internet.
 *
 * Cuando cambies algún archivo de la web, sube el número de VERSION
 * para que los celulares descarguen lo nuevo.
 */
const VERSION = 'agua-1.12';
const ARCHIVOS = [
  './', 'index.html', 'estilos.css', 'app.js', 'config.js', 'manifest.webmanifest',
  'iconos/icono-192.png', 'iconos/icono-512.png', 'iconos/favicon-32.png', 'iconos/logo-blanco.png'
];

self.addEventListener('install', evento => {
  evento.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', evento => {
  evento.waitUntil(
    caches.keys()
      .then(claves => Promise.all(claves.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Primero internet (para tener siempre lo último); si no hay señal, lo guardado.
// cache: 'no-cache' = preguntarle siempre a GitHub si el archivo cambió (si no cambió, responde
// rápido con "304 sin cambios"). Sin esto, el celular podía usar una copia de hasta 10 minutos.
self.addEventListener('fetch', evento => {
  const url = new URL(evento.request.url);
  if (evento.request.method !== 'GET' || url.origin !== self.location.origin) return; // API y fuentes: directo
  evento.respondWith(
    fetch(evento.request, { cache: 'no-cache' })
      .then(resp => {
        const copia = resp.clone();
        caches.open(VERSION).then(c => c.put(evento.request, copia));
        return sinCacheDelNavegador(resp);
      })
      .catch(() => caches.match(evento.request).then(r => r || caches.match('index.html')))
  );
});

/*
 * GitHub manda "Cache-Control: max-age=600". Si la respuesta llega así a la página, Chrome la
 * reutiliza hasta 10 minutos sin volver a preguntar (ni siquiera a este service worker), y el
 * celular sigue viendo la versión anterior. Por eso se entrega con "no-cache".
 */
function sinCacheDelNavegador(resp) {
  if (!resp.ok || resp.type !== 'basic') return resp;
  const cabeceras = new Headers(resp.headers);
  cabeceras.set('Cache-Control', 'no-cache');
  return new Response(resp.body, { status: resp.status, statusText: resp.statusText, headers: cabeceras });
}
