const { ipcRenderer } = require('electron');

document.querySelector('.minimizeBtn').addEventListener('click', () => {
  ipcRenderer.send('minimize-window');
});

document.querySelector('.closeBtn').addEventListener('click', () => {
  ipcRenderer.send('close-window');
});
