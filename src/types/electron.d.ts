export interface ElectronAPI {
  vault: {
    storeKey: (keyId: string, keyData: string) => Promise<{ success: boolean; error?: string }>;
    retrieveKey: (keyId: string) => Promise<{ success: boolean; key?: string; error?: string }>;
    deleteKey: (keyId: string) => Promise<{ success: boolean; error?: string }>;
    listKeys: () => Promise<{ success: boolean; keys?: any[]; error?: string }>;
    rotateKey: (keyId: string, newKeyData: string) => Promise<{ success: boolean; error?: string }>;
  };
  context: {
    generateContext: (projectData: any) => Promise<{ success: boolean; context?: string; error?: string }>;
    saveContext: (contextId: string, content: string) => Promise<{ success: boolean; error?: string }>;
    loadContext: (contextId: string) => Promise<{ success: boolean; context?: string; error?: string }>;
    listContexts: () => Promise<{ success: boolean; contexts?: string[]; error?: string }>;
    deleteContext: (contextId: string) => Promise<{ success: boolean; error?: string }>;
  };
  features: {
    generateDocs: (requirements: string) => Promise<{ success: boolean; docs?: string; error?: string }>;
    saveDocs: (docId: string, content: string) => Promise<{ success: boolean; error?: string }>;
    loadDocs: (docId: string) => Promise<{ success: boolean; docs?: string; error?: string }>;
    extractRequirements: (text: string) => Promise<{ success: boolean; requirements?: any; error?: string }>;
  };
  boltPlan: {
    generatePlan: (planData: any) => Promise<{ success: boolean; plan?: string; error?: string }>;
    generateChecklist: (planId: string) => Promise<{ success: boolean; checklist?: any; error?: string }>;
    generateCommands: (planId: string) => Promise<{ success: boolean; commands?: string[]; error?: string }>;
    savePlan: (planId: string, content: string) => Promise<{ success: boolean; error?: string }>;
  };
  automation: {
    openBoltNew: () => Promise<{ success: boolean; sessionId?: string; error?: string }>;
    executeCommand: (command: string) => Promise<{ success: boolean; result?: any; error?: string }>;
    getSessionStatus: () => Promise<any>;
    closeSession: () => Promise<boolean>;
    trackProgress: () => Promise<{ success: boolean; progress?: any; error?: string }>;
  };
  system: {
    getVersion: () => Promise<string>;
    showOpenDialog: (options: any) => Promise<{ success: boolean; result?: any; error?: string }>;
    showSaveDialog: (options: any) => Promise<{ success: boolean; result?: any; error?: string }>;
    showMessageBox: (options: any) => Promise<{ success: boolean; result?: any; error?: string }>;
  };
  crypto: {
    generateKeyPair: () => Promise<{ success: boolean; keyPair?: any; error?: string }>;
    encrypt: (data: string, publicKey: string) => Promise<{ success: boolean; encrypted?: string; error?: string }>;
    decrypt: (encryptedData: string, privateKey: string) => Promise<{ success: boolean; decrypted?: string; error?: string }>;
    hash: (data: string) => Promise<{ success: boolean; hash?: string; error?: string }>;
  };
  on: (channel: string, callback: (...args: any[]) => void) => void;
  removeListener: (channel: string, callback: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}