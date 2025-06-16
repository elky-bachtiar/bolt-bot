import React, { useState, useEffect } from 'react';
import { Plus, Key, Trash2, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useToast } from '../hooks/useToast';
import { motion } from 'framer-motion';

interface ApiKey {
  id: string;
  created: string;
  lastAccessed: string;
  rotationCount: number;
  type: 'claude-api' | 'encryption' | 'signing';
}

export function KeyManagement() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingKey, setIsAddingKey] = useState(false);
  const [newKeyId, setNewKeyId] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [showKeyValue, setShowKeyValue] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    try {
      setIsLoading(true);
      const result = await window.electronAPI.vault.listKeys();
      
      if (result.success) {
        setKeys(result.keys);
      } else {
        addToast({
          title: 'Error',
          description: 'Failed to load API keys',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Failed to load keys:', error);
      addToast({
        title: 'Error',
        description: 'Failed to load API keys',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddKey = async () => {
    if (!newKeyId.trim() || !newKeyValue.trim()) {
      addToast({
        title: 'Validation Error',
        description: 'Please provide both key ID and value',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsAddingKey(true);
      const result = await window.electronAPI.vault.storeKey(newKeyId, newKeyValue);
      
      if (result.success) {
        addToast({
          title: 'Success',
          description: 'API key stored securely'
        });
        setNewKeyId('');
        setNewKeyValue('');
        await loadKeys();
      } else {
        addToast({
          title: 'Error',
          description: result.error || 'Failed to store API key',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Failed to add key:', error);
      addToast({
        title: 'Error',
        description: 'Failed to store API key',
        variant: 'destructive'
      });
    } finally {
      setIsAddingKey(false);
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    try {
      const result = await window.electronAPI.vault.deleteKey(keyId);
      
      if (result.success) {
        addToast({
          title: 'Success',
          description: 'API key deleted'
        });
        await loadKeys();
      } else {
        addToast({
          title: 'Error',
          description: 'Failed to delete API key',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Failed to delete key:', error);
      addToast({
        title: 'Error',
        description: 'Failed to delete API key',
        variant: 'destructive'
      });
    }
  };

  const handleRotateKey = async (keyId: string) => {
    const newKey = prompt('Enter new API key value:');
    if (!newKey) return;

    try {
      const result = await window.electronAPI.vault.rotateKey(keyId, newKey);
      
      if (result.success) {
        addToast({
          title: 'Success',
          description: 'API key rotated successfully'
        });
        await loadKeys();
      } else {
        addToast({
          title: 'Error',
          description: result.error || 'Failed to rotate API key',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Failed to rotate key:', error);
      addToast({
        title: 'Error',
        description: 'Failed to rotate API key',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          API Key Management
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Securely manage your Claude API keys and other credentials
        </p>
      </div>

      {/* Add New Key */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add New API Key</span>
          </CardTitle>
          <CardDescription>
            Store a new API key securely with encryption
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Key Identifier
              </label>
              <Input
                placeholder="e.g., claude-production"
                value={newKeyId}
                onChange={(e) => setNewKeyId(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                API Key Value
              </label>
              <div className="relative">
                <Input
                  type={showKeyValue ? 'text' : 'password'}
                  placeholder="sk-ant-..."
                  value={newKeyValue}
                  onChange={(e) => setNewKeyValue(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowKeyValue(!showKeyValue)}
                >
                  {showKeyValue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
          <Button 
            onClick={handleAddKey} 
            disabled={isAddingKey}
            className="w-full md:w-auto"
          >
            {isAddingKey ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Storing Key...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Store API Key
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Keys */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="w-5 h-5" />
            <span>Stored API Keys</span>
          </CardTitle>
          <CardDescription>
            Manage your existing API keys
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
              <span className="ml-2 text-slate-600 dark:text-slate-400">
                Loading keys...
              </span>
            </div>
          ) : keys.length === 0 ? (
            <div className="text-center py-8">
              <Key className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                No API keys stored yet
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Add your first API key to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {keys.map((key, index) => (
                <motion.div
                  key={key.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 dark:text-white">
                        {key.id}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400 mt-1">
                        <span>Type: {key.type}</span>
                        <span>Created: {new Date(key.created).toLocaleDateString()}</span>
                        <span>Rotations: {key.rotationCount}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRotateKey(key.id)}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Rotate
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteKey(key.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                Security Information
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• All API keys are encrypted at rest using AES-256 encryption</li>
                <li>• Keys are stored locally on your device and never transmitted to external servers</li>
                <li>• Regular key rotation is recommended for enhanced security</li>
                <li>• Audit logs track all key operations for compliance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}