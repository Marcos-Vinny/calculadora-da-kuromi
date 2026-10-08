const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');


if (!app.requestSingleInstanceLock()) {
  app.quit();
}

let janela = null;

function criarJanela() {
  janela = new BrowserWindow({
    width: 408,         
    height: 552,        
    useContentSize: true,
    center: true,       
    frame: false,        
    transparent: true,  
    backgroundColor: '#00000000',
    hasShadow: false,
    resizable: false,    
    maximizable: false,  
    fullscreenable: false,
    minimizable: true,
    title: 'Kuromi Calculadora',
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      devTools: false,
    },
  });

  janela.setMenu(null);
  janela.webContents.setVisualZoomLevelLimits(1, 1);
  janela.loadFile(path.join(__dirname, 'src', 'index.html'));
  janela.on('closed', () => { janela = null; });
}

ipcMain.on('janela:minimizar', () => { if (janela) janela.minimize(); });
ipcMain.on('janela:fechar', () => { if (janela) janela.close(); });

app.on('second-instance', () => {
  if (janela) {
    if (janela.isMinimized()) janela.restore();
    janela.focus();
  }
});

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  criarJanela();
});

app.on('window-all-closed', () => app.quit());
