import { ipcMain, dialog, app, shell } from 'electron';
import { vaultService } from '../services/vault.js';
import { contextService } from '../services/context.js';
import { automationService } from '../services/automation.js';
import { cryptoService } from '../services/crypto.js';

export function setupIpcHandlers(): void {
  // Vault operations
  ipcMain.handle('vault:store-key', async (_, keyId: string, keyData: string) => {
    try {
      await vaultService.storeKey(keyId, keyData);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('vault:retrieve-key', async (_, keyId: string) => {
    try {
      const key = await vaultService.retrieveKey(keyId);
      return { success: true, key };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('vault:delete-key', async (_, keyId: string) => {
    try {
      const deleted = await vaultService.deleteKey(keyId);
      return { success: deleted };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('vault:list-keys', async () => {
    try {
      const keys = await vaultService.listKeys();
      return { success: true, keys };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('vault:rotate-key', async (_, keyId: string, newKeyData: string) => {
    try {
      await vaultService.rotateKey(keyId, newKeyData);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  // Context operations
  ipcMain.handle('context:generate', async (_, projectData: any) => {
    try {
      const context = await contextService.generateContext(projectData);
      return { success: true, context };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('context:save', async (_, contextId: string, content: string) => {
    try {
      await contextService.saveContext(contextId, content);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('context:load', async (_, contextId: string) => {
    try {
      const context = await contextService.loadContext(contextId);
      return { success: true, context };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  // Browser automation operations
  ipcMain.handle('automation:open-bolt-new', async () => {
    try {
      const session = await automationService.openBoltNew();
      return { success: true, sessionId: session.id };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('automation:execute-command', async (_, command: string) => {
    try {
      const result = await automationService.executeCommand(command);
      return { success: true, result };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  // Crypto operations
  ipcMain.handle('crypto:generate-key-pair', async () => {
    try {
      const keyPair = await cryptoService.generateKeyPair();
      return { success: true, keyPair };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('crypto:encrypt', async (_, data: string, publicKey: string) => {
    try {
      const encrypted = await cryptoService.encrypt(data, publicKey);
      return { success: true, encrypted };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('crypto:decrypt', async (_, encryptedData: string, privateKey: string) => {
    try {
      const decrypted = await cryptoService.decrypt(encryptedData, privateKey);
      return { success: true, decrypted };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  // System operations
  ipcMain.handle('system:get-version', () => {
    return app.getVersion();
  });

  ipcMain.handle('system:show-open-dialog', async (_, options: any) => {
    try {
      const result = await dialog.showOpenDialog(options);
      return { success: true, result };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('system:show-save-dialog', async (_, options: any) => {
    try {
      const result = await dialog.showSaveDialog(options);
      return { success: true, result };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('system:show-message-box', async (_, options: any) => {
    try {
      const result = await dialog.showMessageBox(options);
      return { success: true, result };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  console.log('IPC handlers setup complete');
}