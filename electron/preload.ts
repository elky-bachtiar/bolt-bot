import { contextBridge, ipcRenderer } from 'electron';

// Define the API that will be exposed to the renderer process
const electronAPI = {
  // Vault operations
  vault: {
    storeKey: (keyId: string, keyData: string) => ipcRenderer.invoke('vault:store-key', keyId, keyData),
    retrieveKey: (keyId: string) => ipcRenderer.invoke('vault:retrieve-key', keyId),
    deleteKey: (keyId: string) => ipcRenderer.invoke('vault:delete-key', keyId),
    listKeys: () => ipcRenderer.invoke('vault:list-keys'),
    rotateKey: (keyId: string, newKeyData: string) => ipcRenderer.invoke('vault:rotate-key', keyId, newKeyData)
  },

  // Project context operations
  context: {
    generateContext: (projectData: any) => ipcRenderer.invoke('context:generate', projectData),
    saveContext: (contextId: string, content: string) => ipcRenderer.invoke('context:save', contextId, content),
    loadContext: (contextId: string) => ipcRenderer.invoke('context:load', contextId),
    listContexts: () => ipcRenderer.invoke('context:list'),
    deleteContext: (contextId: string) => ipcRenderer.invoke('context:delete', contextId)
  },

  // Feature documentation operations
  features: {
    generateDocs: (requirements: string) => ipcRenderer.invoke('features:generate-docs', requirements),
    saveDocs: (docId: string, content: string) => ipcRenderer.invoke('features:save-docs', docId, content),
    loadDocs: (docId: string) => ipcRenderer.invoke('features:load-docs', docId),
    extractRequirements: (text: string) => ipcRenderer.invoke('features:extract-requirements', text)
  },

  // Bolt plan generation operations
  boltPlan: {
    generatePlan: (planData: any) => ipcRenderer.invoke('bolt-plan:generate', planData),
    generateChecklist: (planId: string) => ipcRenderer.invoke('bolt-plan:generate-checklist', planId),
    generateCommands: (planId: string) => ipcRenderer.invoke('bolt-plan:generate-commands', planId),
    savePlan: (planId: string, content: string) => ipcRenderer.invoke('bolt-plan:save', planId, content)
  },

  // Browser automation operations
  automation: {
    openBoltNew: () => ipcRenderer.invoke('automation:open-bolt-new'),
    executeCommand: (command: string) => ipcRenderer.invoke('automation:execute-command', command),
    getSessionStatus: () => ipcRenderer.invoke('automation:get-session-status'),
    closeSession: () => ipcRenderer.invoke('automation:close-session'),
    trackProgress: () => ipcRenderer.invoke('automation:track-progress')
  },

  // System operations
  system: {
    getVersion: () => ipcRenderer.invoke('system:get-version'),
    showOpenDialog: (options: any) => ipcRenderer.invoke('system:show-open-dialog', options),
    showSaveDialog: (options: any) => ipcRenderer.invoke('system:show-save-dialog', options),
    showMessageBox: (options: any) => ipcRenderer.invoke('system:show-message-box', options)
  },

  // Encryption operations (client-side)
  crypto: {
    generateKeyPair: () => ipcRenderer.invoke('crypto:generate-key-pair'),
    encrypt: (data: string, publicKey: string) => ipcRenderer.invoke('crypto:encrypt', data, publicKey),
    decrypt: (encryptedData: string, privateKey: string) => ipcRenderer.invoke('crypto:decrypt', encryptedData, privateKey),
    hash: (data: string) => ipcRenderer.invoke('crypto:hash', data)
  },

  // Event listeners
  on: (channel: string, callback: (...args: any[]) => void) => {
    const validChannels = [
      'automation:progress-update',
      'vault:key-rotation',
      'system:error',
      'system:notification'
    ];
    
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, callback);
    }
  },

  removeListener: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.removeListener(channel, callback);
  }
};

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// Type definitions for TypeScript
export type ElectronAPI = typeof electronAPI;