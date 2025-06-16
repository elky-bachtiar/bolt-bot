import React from 'react';
import { Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
          <span>© 2025 Bolt Bot</span>
          <span>•</span>
          <span>v1.0.0</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Powered by
          </span>
          <div className="flex items-center space-x-1 text-sm font-medium text-blue-600 dark:text-blue-400">
            <Zap className="w-4 h-4" />
            <span>Bolt.new</span>
          </div>
        </div>
      </div>
    </footer>
  );
}