import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { app } from 'electron';

interface KeyMetadata {
  id: string;
  created: Date;
  lastAccessed: Date;
  rotationCount: number;
  type: 'claude-api' | 'encryption' | 'signing';
}

interface StoredKey {
  metadata: KeyMetadata;
  encryptedData: string;
  iv: string;
  authTag: string;
}

class VaultService {
  private vaultPath: string;
  private masterKey: Buffer;

  constructor() {
    this.vaultPath = path.join(app.getPath('userData'), 'vault');
    this.masterKey = this.deriveMasterKey();
  }

  async initialize(): Promise<void> {
    try {
      await fs.mkdir(this.vaultPath, { recursive: true });
      console.log('Vault initialized successfully');
    } catch (error) {
      console.error('Failed to initialize vault:', error);
      throw error;
    }
  }

  private deriveMasterKey(): Buffer {
    // In production, this should be derived from user credentials or hardware security module
    const machineId = require('os').hostname();
    const appData = 'bolt-bot-vault-key';
    return crypto.pbkdf2Sync(machineId + appData, 'salt', 100000, 32, 'sha512');
  }

  private encrypt(data: string): { encryptedData: string; iv: string; authTag: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher('aes-256-gcm', this.masterKey);
    cipher.setAAD(Buffer.from('bolt-bot-vault'));
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encryptedData: encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  private decrypt(encryptedData: string, iv: string, authTag: string): string {
    const decipher = crypto.createDecipher('aes-256-gcm', this.masterKey);
    decipher.setAAD(Buffer.from('bolt-bot-vault'));
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  async storeKey(keyId: string, keyData: string, type: KeyMetadata['type'] = 'claude-api'): Promise<void> {
    try {
      const encrypted = this.encrypt(keyData);
      const metadata: KeyMetadata = {
        id: keyId,
        created: new Date(),
        lastAccessed: new Date(),
        rotationCount: 0,
        type
      };

      const storedKey: StoredKey = {
        metadata,
        encryptedData: encrypted.encryptedData,
        iv: encrypted.iv,
        authTag: encrypted.authTag
      };

      const keyPath = path.join(this.vaultPath, `${keyId}.json`);
      await fs.writeFile(keyPath, JSON.stringify(storedKey, null, 2));
      
      console.log(`Key ${keyId} stored successfully`);
    } catch (error) {
      console.error(`Failed to store key ${keyId}:`, error);
      throw error;
    }
  }

  async retrieveKey(keyId: string): Promise<string | null> {
    try {
      const keyPath = path.join(this.vaultPath, `${keyId}.json`);
      const keyFileContent = await fs.readFile(keyPath, 'utf8');
      const storedKey: StoredKey = JSON.parse(keyFileContent);
      
      // Update last accessed time
      storedKey.metadata.lastAccessed = new Date();
      await fs.writeFile(keyPath, JSON.stringify(storedKey, null, 2));
      
      const decryptedKey = this.decrypt(
        storedKey.encryptedData,
        storedKey.iv,
        storedKey.authTag
      );
      
      console.log(`Key ${keyId} retrieved successfully`);
      return decryptedKey;
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        return null; // Key not found
      }
      console.error(`Failed to retrieve key ${keyId}:`, error);
      throw error;
    }
  }

  async deleteKey(keyId: string): Promise<boolean> {
    try {
      const keyPath = path.join(this.vaultPath, `${keyId}.json`);
      await fs.unlink(keyPath);
      console.log(`Key ${keyId} deleted successfully`);
      return true;
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        return false; // Key not found
      }
      console.error(`Failed to delete key ${keyId}:`, error);
      throw error;
    }
  }

  async listKeys(): Promise<KeyMetadata[]> {
    try {
      const files = await fs.readdir(this.vaultPath);
      const keyFiles = files.filter(file => file.endsWith('.json'));
      
      const keys: KeyMetadata[] = [];
      for (const file of keyFiles) {
        const keyPath = path.join(this.vaultPath, file);
        const keyFileContent = await fs.readFile(keyPath, 'utf8');
        const storedKey: StoredKey = JSON.parse(keyFileContent);
        keys.push(storedKey.metadata);
      }
      
      return keys;
    } catch (error) {
      console.error('Failed to list keys:', error);
      throw error;
    }
  }

  async rotateKey(keyId: string, newKeyData: string): Promise<void> {
    try {
      const keyPath = path.join(this.vaultPath, `${keyId}.json`);
      const keyFileContent = await fs.readFile(keyPath, 'utf8');
      const storedKey: StoredKey = JSON.parse(keyFileContent);
      
      const encrypted = this.encrypt(newKeyData);
      storedKey.encryptedData = encrypted.encryptedData;
      storedKey.iv = encrypted.iv;
      storedKey.authTag = encrypted.authTag;
      storedKey.metadata.rotationCount++;
      storedKey.metadata.lastAccessed = new Date();
      
      await fs.writeFile(keyPath, JSON.stringify(storedKey, null, 2));
      console.log(`Key ${keyId} rotated successfully`);
    } catch (error) {
      console.error(`Failed to rotate key ${keyId}:`, error);
      throw error;
    }
  }
}

const vaultService = new VaultService();

export async function initializeVault(): Promise<void> {
  await vaultService.initialize();
}

export { vaultService };