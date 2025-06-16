import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Bell, Palette, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../hooks/useToast';

export function Settings() {
  const [settings, setSettings] = useState({
    autoSave: true,
    notifications: true,
    darkMode: false,
    apiTimeout: 30,
    maxRetries: 3
  });
  const { addToast } = useToast();

  const handleSaveSettings = () => {
    // In a real app, this would save to electron store or backend
    addToast({
      title: 'Success',
      description: 'Settings saved successfully'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Configure Bolt Bot preferences and security settings
        </p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5" />
            <span>General Settings</span>
          </CardTitle>
          <CardDescription>
            Basic application preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">
                Auto-save contexts
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Automatically save generated contexts and plans
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => setSettings(prev => ({ ...prev, autoSave: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                API Timeout (seconds)
              </label>
              <Input
                type="number"
                value={settings.apiTimeout}
                onChange={(e) => setSettings(prev => ({ ...prev, apiTimeout: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Max Retries
              </label>
              <Input
                type="number"
                value={settings.maxRetries}
                onChange={(e) => setSettings(prev => ({ ...prev, maxRetries: parseInt(e.target.value) }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Security Settings</span>
          </CardTitle>
          <CardDescription>
            Security and privacy configurations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
              Encryption Status
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• All API keys are encrypted with AES-256</li>
              <li>• Local storage uses envelope encryption</li>
              <li>• Zero-knowledge architecture for credentials</li>
              <li>• Audit logging enabled for all operations</li>
            </ul>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">
                Enable notifications
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Show system notifications for important events
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings(prev => ({ ...prev, notifications: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="w-5 h-5" />
            <span>About Bolt Bot</span>
          </CardTitle>
          <CardDescription>
            Application information and version details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Version</p>
              <p className="text-slate-600 dark:text-slate-400">1.0.0</p>
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Build</p>
              <p className="text-slate-600 dark:text-slate-400">2025.01.27</p>
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Platform</p>
              <p className="text-slate-600 dark:text-slate-400">Electron + React</p>
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">License</p>
              <p className="text-slate-600 dark:text-slate-400">MIT</p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Bolt Bot is an AI-powered project planning assistant that automates the initialization 
              and setup of new projects. Built with security-first principles and modern web technologies.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          Save Settings
        </Button>
      </div>
    </div>
  );
}