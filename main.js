// main.js

const { app, BrowserWindow, ipcMain, screen } = require('electron/main');
const path = require('node:path');

// (Opcional pero recomendado) Forzar la escala a 1 para evitar el "zoom" del SO
// Esto hace que nuestro cálculo de escala sea el único que importa.
app.commandLine.appendSwitch('force-device-scale-factor', '1');

// --- Constantes de tu diseño ---
const BASE_WIDTH = 545;
const BASE_HEIGHT = 900;

function createWindow() {
  // 1. Obtener el tamaño de la pantalla del usuario
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: displayW, height: displayH } = primaryDisplay.workAreaSize;

  // 2. Calcular la escala necesaria para que quepa la aplicación
  // Se usará el factor más restrictivo (ancho o alto)
  // Math.min(1, ...) asegura que nunca escalemos hacia arriba (más grande que el 100%)
  const scale = Math.min(1, displayW / BASE_WIDTH, displayH / BASE_HEIGHT);

  // 3. Calcular el tamaño final de la ventana basado en la escala
  const winWidth = Math.floor(BASE_WIDTH * scale);
  const winHeight = Math.floor(BASE_HEIGHT * scale);

  const win = new BrowserWindow({
    width: winWidth,     // Usamos el ancho calculado
    height: winHeight,   // Usamos el alto calculado
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    resizable: false,    // ¡IMPORTANTE! Esto soluciona el problema de redimensionamiento
    transparent: true,
    frame: false,
    icon: path.join(__dirname, 'assets/cinna1.png'),
    titleBarStyle: 'hidden',
    // (Opcional) Para que la ventana no sea demasiado pequeña
    minWidth: Math.floor(BASE_WIDTH * 0.5),
    minHeight: Math.floor(BASE_HEIGHT * 0.5),
  });

  win.center(); // Centra la ventana ya con el tamaño correcto
  win.loadFile('index.html');
  
  // win.webContents.openDevTools(); // Descomenta para depurar

  // 4. Cuando la página cargue, le decimos que escale el contenido
  win.webContents.on('did-finish-load', () => {
    // Inyectamos CSS para escalar el contenedor #app
    // Es más simple y seguro que el script anterior
    win.webContents.executeJavaScript(`
      const appContainer = document.getElementById('app');
      if (appContainer) {
        appContainer.style.position = 'absolute';
        appContainer.style.left = '50%';
        appContainer.style.top = '50%';
        appContainer.style.transformOrigin = 'center center';
        appContainer.style.transform = 'translate(-50%, -50%) scale(${scale})';
      }
    `).catch(err => console.error('Error al aplicar escala:', err));
  });

  return win;
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Tus handlers de IPC (están perfectos)
ipcMain.on('minimize-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.minimize();
});

ipcMain.on('close-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.close();
});