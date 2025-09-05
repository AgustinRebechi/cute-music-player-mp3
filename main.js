const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('node:path');

if (process.env.NODE_ENV !== 'production') {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
    });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 545,
    height: 900,
    x: 688,
    y: 80,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    resizable: false,
    transparent: true,
    frame: false,
    icon: path.join(__dirname, 'assets/cinna1.png'),
    titleBarStyle: 'hidden',})
  win.loadFile('index.html')
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('minimize-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.minimize();
});

ipcMain.on('close-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.close();
});
