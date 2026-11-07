/*
 * Service worker: guarda la "cáscara" de la app (HTML, CSS, JS, íconos)
 * para que abra rápido y se pueda instalar.
 * Los datos (API de Apps Script) NUNCA se guardan aquí: siempre van a internet.
 *
 * Cuando cambies algún archivo de la web, sube el número de VERSION
 * para que los celulares descarguen lo nuevo.
 */
const VERSION = 'agua-1.6';
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
self.addEventListener('fetch', evento => {
  const url = new URL(evento.request.url);
  if (evento.request.method !== 'GET' || url.origin !== self.location.origin) return; // API y fuentes: directo
  evento.respondWith(
    fetch(evento.request)
      .then(resp => {
        const copia = resp.clone();
        caches.open(VERSION).then(c => c.put(evento.request, copia));
        return resp;
      })
      .catch(() => caches.match(evento.request).then(r => r || caches.match('index.html')))
  );
});
