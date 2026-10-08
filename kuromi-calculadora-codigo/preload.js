const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('janela', {
  minimizar: () => ipcRenderer.send('janela:minimizar'),
  fechar: () => ipcRenderer.send('janela:fechar'),
});
