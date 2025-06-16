import { app, BrowserWindow, ipcMain, Menu, dialog } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { isDev } from './utils/env.js';
import { setupSecurityPolicies } from './security/policies.js';
import { initializeVault } from './services/vault.js';
import { setupIpcHandlers } from './ipc/handlers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Keep a global reference of the window object
let mainWindow: BrowserWindow | null = null;

async function createMainWindow(): Promise<BrowserWindow> {
  // Create the browser window
  const window = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    show: false,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: false
    },
    icon: process.platform === 'linux' ? path.join(__dirname, '../assets/icon.png') : undefined
  });

  // Apply security policies
  setupSecurityPolicies(window);

  // Load the app
  if (isDev()) {
    await window.loadURL('http://localhost:5173');
    window.webContents.openDevTools();
  } else {
    await window.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Show window when ready
  window.once('ready-to-show', () => {
    window.show();
    
    // Focus on window (required for some Linux window managers)
    if (isDev()) {
      window.focus();
    }
  });

  // Handle window closed
  window.on('closed', () => {
    mainWindow = null;
  });

  return window;
}

// This method will be called when Electron has finished initialization
app.whenReady().then(async () => {
  try {
    // Initialize secure services
    await initializeVault();
    
    // Create main window
    mainWindow = await createMainWindow();
    
    // Setup IPC handlers
    setupIpcHandlers();
    
    // Set application menu
    if (process.platform === 'darwin') {
      const template: Electron.MenuItemConstructorOptions[] = [
        {
          label: 'Bolt Bot',
          submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
          ]
        },
        {
          label: 'File',
          submenu: [
            { role: 'close' }
          ]
        },
        {
          label: 'Edit',
          submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'selectAll' }
          ]
        },
        {
          label: 'View',
          submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
          ]
        },
        {
          label: 'Window',
          submenu: [
            { role: 'minimize' },
            { role: 'zoom' },
            { type: 'separator' },
            { role: 'front' }
          ]
        }
      ];
      
      const menu = Menu.buildFromTemplate(template);
      Menu.setApplicationMenu(menu);
    } else {
      Menu.setApplicationMenu(null);
    }
    
  } catch (error) {
    console.error('Failed to initialize application:', error);
    await dialog.showErrorBox('Initialization Error', 'Failed to initialize Bolt Bot. Please check your configuration.');
    app.quit();
  }
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS, keep the app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', async () => {
  // On macOS, re-create a window when the dock icon is clicked
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = await createMainWindow();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (_, contents) => {
  // Handle new window creation with the modern API
  contents.setWindowOpenHandler(({ url }) => {
    // Optionally, you can handle specific URLs here
    // For now, we'll just prevent all new windows
    return { action: 'deny' };
  });
});

// Handle certificate errors
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  if (isDev()) {
    // In development, ignore certificate errors for localhost
    event.preventDefault();
    callback(true);
  } else {
    // In production, use default behavior
    callback(false);
  }
});

export { mainWindow };