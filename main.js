const { app, BrowserWindow, ipcMain, screen } = require('electron/main');
const path = require('node:path');

// hot-reload si no estás en producción (opcional)
if (app && !app.isPackaged) {
  require('electron-reload')(__dirname, {
    electron: require('path').join(__dirname, 'node_modules', '.bin', 'electron')
  });
}

// --- Ajustá estas constantes si querés otra "base" ---
const BASE_WIDTH = 545;   // ancho en px que usaste como referencia en tu CSS
const BASE_HEIGHT = 900;  // alto en px de referencia
const MIN_SCALE = 0.9;   // escala mínima para que no quede diminuto (ajustalo si querés)

function createWindow() {
  const display = screen.getPrimaryDisplay();
  const { width: displayW, height: displayH } = display.workAreaSize;

  // no dejamos la ventana más grande que la pantalla
  const winWidth = Math.min(BASE_WIDTH, displayW);
  const winHeight = Math.min(BASE_HEIGHT, displayH);

  const win = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    resizable: true,
    transparent: true,
    frame: false,
    icon: path.join(__dirname, 'assets/cinna1.png'),
    titleBarStyle: 'hidden'
  });

  win.center();
  win.loadFile('index.html');

  // función que calcula escala y la aplica en el renderer
  const applyScale = () => {
    const { width: w, height: h } = win.getBounds();
    // escala basada en la comparación con el diseño base
    let scale = Math.min(1, w / BASE_WIDTH, h / BASE_HEIGHT);
    if (scale < MIN_SCALE) scale = MIN_SCALE;

    // Inyectamos JS que crea/ajusta #app y aplica la transform
    win.webContents.executeJavaScript(`
      (function(){
        const scale = ${scale};
        let app = document.getElementById('app');

        if (!app) {
          app = document.createElement('div');
          app.id = 'app';
          // mover todo el body dentro de #app (si no lo tenés envuelto ya)
          while (document.body.firstChild) {
            app.appendChild(document.body.firstChild);
          }
          document.body.appendChild(app);
        }

        // estilos que garantizan que el layout quede relativo al #app
        app.style.position = 'absolute';
        app.style.left = '50%';
        app.style.top = '0';
        app.style.width = '${BASE_WIDTH}px';
        app.style.height = '${BASE_HEIGHT}px';
        app.style.transformOrigin = 'top center';
        // centrar horizontalmente y escalar
        app.style.transform = 'translate(-50%, -50%) scale(' + scale + ')';
        app.style.top = '50%'; // aseguramos que esté en el medio

        // evitar scroll y ajustar body (por si aparece scrollbar)
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        document.body.style.margin = '0';
        document.body.style.overflow = 'hidden';
      })();
    `).catch(err => console.error('applyScale error:', err));
  };

  win.webContents.on('did-finish-load', applyScale);
  win.on('resize', applyScale);

  return win;
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// tus handlers ipcMain (los dejo como estaban)
ipcMain.on('minimize-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.minimize();
});

ipcMain.on('close-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.close();
});
