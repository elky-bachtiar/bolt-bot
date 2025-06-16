import React, { useEffect, useState } from 'react';
import { Key, FileText, List, Zap, Globe, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface DashboardStats {
  apiKeys: number;
  contexts: number;
  features: number;
  plans: number;
  activeSessions: number;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    apiKeys: 0,
    contexts: 0,
    features: 0,
    plans: 0,
    activeSessions: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true);
      
      // Load API keys count
      const keysResult = await window.electronAPI.vault.listKeys();
      const apiKeys = keysResult.success ? keysResult.keys.length : 0;

      // Load contexts count
      const contextsResult = await window.electronAPI.context.listContexts();
      const contexts = contextsResult.success ? contextsResult.contexts.length : 0;

      // Get automation session status
      const sessionResult = await window.electronAPI.automation.getSessionStatus();
      const activeSessions = sessionResult.status === 'active' ? 1 : 0;

      setStats({
        apiKeys,
        contexts,
        features: 0, // TODO: Implement features count
        plans: 0, // TODO: Implement plans count
        activeSessions
      });
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Add API Key',
      description: 'Securely store a new Claude API key',
      icon: Key,
      action: () => navigate('/keys'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Generate Context',
      description: 'Create CLAUDE.md for your project',
      icon: FileText,
      action: () => navigate('/context'),
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Document Features',
      description: 'Extract requirements and create docs',
      icon: List,
      action: () => navigate('/features'),
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Generate Bolt Plan',
      description: 'Create implementation checklist',
      icon: Zap,
      action: () => navigate('/bolt-plan'),
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const statsCards = [
    {
      title: 'API Keys',
      value: stats.apiKeys,
      icon: Key,
      description: 'Stored securely',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Project Contexts',
      value: stats.contexts,
      icon: FileText,
      description: 'Generated contexts',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Feature Docs',
      value: stats.features,
      icon: List,
      description: 'Documented features',
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Active Sessions',
      value: stats.activeSessions,
      icon: Activity,
      description: 'Browser automation',
      color: 'text-orange-600 dark:text-orange-400'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Welcome to Bolt Bot - Your AI-powered project planning assistant
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {isLoading ? '...' : stat.value}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      {stat.description}
                    </p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
                    onClick={action.action}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`bg-gradient-to-r ${action.color} p-3 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {action.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest actions and system events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-slate-600 dark:text-slate-400">
                Bolt Bot initialized successfully
              </span>
              <span className="text-slate-400 dark:text-slate-500 ml-auto">
                Just now
              </span>
            </div>
            {stats.apiKeys > 0 && (
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-slate-600 dark:text-slate-400">
                  {stats.apiKeys} API key{stats.apiKeys > 1 ? 's' : ''} configured
                </span>
                <span className="text-slate-400 dark:text-slate-500 ml-auto">
                  Recently
                </span>
              </div>
            )}
            {stats.activeSessions > 0 && (
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-slate-600 dark:text-slate-400">
                  Browser automation session active
                </span>
                <span className="text-slate-400 dark:text-slate-500 ml-auto">
                  Active
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}