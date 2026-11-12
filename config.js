/*
 * Configuración de la app.
 * API_URL = la "URL de la aplicación web" de Apps Script (termina en /exec).
 * Si algún día haces una implementación nueva en Apps Script, cambia este link.
 */
const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbxJU0c7BmP6wllXI1e5WCfcsfpfp_cOFpapevBWhJxOdIJGjeAJWXXxF3bC0bHTYIVK/exec',
  VERSION: '1.26.1',

  // v1.26 · Notificaciones push (proyecto de Firebase "Aguita-App" de Miguel).
  // Estos datos son PÚBLICOS: identifican el proyecto, no dan acceso. La clave secreta (cuenta de servicio)
  // está solo en Apps Script → Propiedades del script. Si cambias de proyecto, cambia estos dos bloques.
  FIREBASE: {
    apiKey: 'AIzaSyByVSm9eAf4yRZ52hd70OTPFRL6K2V-jcE',
    authDomain: 'aguita-app-fd4b7.firebaseapp.com',
    projectId: 'aguita-app-fd4b7',
    storageBucket: 'aguita-app-fd4b7.firebasestorage.app',
    messagingSenderId: '779262193579',
    appId: '1:779262193579:web:3e052d6784dd13b7e2acee'
  },
  VAPID: 'BL1P7qtaObGkOw-PtUwQRD18NEbjWud5yRp6fCghcHAc3sx_kUWNO4UnZuikz9Unbt9kB5PFruJepaJxO5fKCi0'
};
