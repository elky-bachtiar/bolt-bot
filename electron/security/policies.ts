import { BrowserWindow, session } from 'electron';

export function setupSecurityPolicies(window: BrowserWindow): void {
  // Content Security Policy
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
          "style-src 'self' 'unsafe-inline'; " +
          "img-src 'self' data: https:; " +
          "font-src 'self' data:; " +
          "connect-src 'self' https: ws: wss:; " +
          "media-src 'self'; " +
          "object-src 'none'; " +
          "base-uri 'self'; " +
          "form-action 'self';"
        ]
      }
    });
  });

  // Note: New window handling is now managed in main.ts using setWindowOpenHandler
  
  // Prevent navigation to external URLs
  window.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    // Allow navigation to localhost in development
    if (parsedUrl.origin !== window.webContents.getURL().split('/').slice(0, 3).join('/')) {
      event.preventDefault();
    }
  });

  // Block external resource loading in production
  window.webContents.session.webRequest.onBeforeRequest((details, callback) => {
    const url = new URL(details.url);
    
    // Allow localhost and file:// in development
    const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    const isFile = url.protocol === 'file:';
    const isDevtools = url.protocol === 'devtools:';
    
    if (process.env.NODE_ENV === 'development' && (isLocalhost || isFile || isDevtools)) {
      callback({});
      return;
    }

    // Block external requests in production
    if (!isFile && !isLocalhost) {
      callback({ cancel: true });
      return;
    }

    callback({});
  });

  // Disable webSecurity in development only
  if (process.env.NODE_ENV === 'development') {
    window.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
      // Allow all permissions in development
      callback(true);
    });
  }
}