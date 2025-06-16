import crypto from 'crypto';

interface KeyPair {
  publicKey: string;
  privateKey: string;
}

class CryptoService {
  async generateKeyPair(): Promise<KeyPair> {
    return new Promise((resolve, reject) => {
      crypto.generateKeyPair('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem'
        }
      }, (err, publicKey, privateKey) => {
        if (err) {
          reject(err);
        } else {
          resolve({ publicKey, privateKey });
        }
      });
    });
  }

  async encrypt(data: string, publicKey: string): Promise<string> {
    try {
      const buffer = Buffer.from(data, 'utf8');
      const encrypted = crypto.publicEncrypt(publicKey, buffer);
      return encrypted.toString('base64');
    } catch (error) {
      console.error('Encryption failed:', error);
      throw error;
    }
  }

  async decrypt(encryptedData: string, privateKey: string): Promise<string> {
    try {
      const buffer = Buffer.from(encryptedData, 'base64');
      const decrypted = crypto.privateDecrypt(privateKey, buffer);
      return decrypted.toString('utf8');
    } catch (error) {
      console.error('Decryption failed:', error);
      throw error;
    }
  }

  async hash(data: string): Promise<string> {
    try {
      const hash = crypto.createHash('sha256');
      hash.update(data);
      return hash.digest('hex');
    } catch (error) {
      console.error('Hashing failed:', error);
      throw error;
    }
  }

  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  deriveKey(password: string, salt: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 100000, 32, 'sha512', (err, derivedKey) => {
        if (err) {
          reject(err);
        } else {
          resolve(derivedKey);
        }
      });
    });
  }
}

const cryptoService = new CryptoService();

export { cryptoService };