import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Key, 
  FileText, 
  List, 
  Zap, 
  Globe,
  Settings
} from 'lucide-react';
import { cn } from '../../utils/cn';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'API Keys', href: '/keys', icon: Key },
  { name: 'Project Context', href: '/context', icon: FileText },
  { name: 'Feature Docs', href: '/features', icon: List },
  { name: 'Bolt Plans', href: '/bolt-plan', icon: Zap },
  { name: 'Automation', href: '/automation', icon: Globe },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  return (
    <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150',
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                  )
                }
              >
                <item.icon
                  className={cn(
                    'mr-3 flex-shrink-0 h-5 w-5',
                    'text-slate-400 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-400'
                  )}
                />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}