import React, { useState, useEffect } from 'react';
import { Globe, Play, Square, RotateCcw, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useToast } from '../hooks/useToast';
import { motion } from 'framer-motion';

interface SessionStatus {
  sessionId?: string;
  status: 'no-session' | 'active' | 'closed' | 'error';
  url?: string;
  startTime?: string;
  isResponsive?: boolean;
  error?: string;
}

export function BrowserAutomation() {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>({ status: 'no-session' });
  const [isLoading, setIsLoading] = useState(false);
  const [command, setCommand] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionHistory, setExecutionHistory] = useState<Array<{
    command: string;
    timestamp: string;
    success: boolean;
  }>>([]);
  const { addToast } = useToast();

  useEffect(() => {
    checkSessionStatus();
    const interval = setInterval(checkSessionStatus, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const checkSessionStatus = async () => {
    try {
      const result = await window.electronAPI.automation.getSessionStatus();
      setSessionStatus(result);
    } catch (error) {
      console.error('Failed to check session status:', error);
    }
  };

  const handleOpenBoltNew = async () => {
    try {
      setIsLoading(true);
      const result = await window.electronAPI.automation.openBoltNew();
      
      if (result.success) {
        addToast({
          title: 'Success',
          description: 'Bolt.new opened successfully',
          variant: 'success'
        });
        await checkSessionStatus();
      } else {
        addToast({
          title: 'Error',
          description: result.error || 'Failed to open Bolt.new',
          variant: 'error'
        });
      }
    } catch (error) {
      console.error('Failed to open Bolt.new:', error);
      addToast({
        title: 'Error',
        description: 'Failed to open Bolt.new',
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteCommand = async () => {
    if (!command.trim()) {
      addToast({
        title: 'Validation Error',
        description: 'Please enter a command to execute',
        variant: 'warning'
      });
      return;
    }

    if (sessionStatus.status !== 'active') {
      addToast({
        title: 'Error',
        description: 'No active browser session. Please open Bolt.new first.',
        variant: 'error'
      });
      return;
    }

    try {
      setIsExecuting(true);
      const result = await window.electronAPI.automation.executeCommand(command);
      
      if (result.success) {
        addToast({
          title: 'Success',
          description: 'Command executed successfully',
          variant: 'success'
        });
        
        setExecutionHistory(prev => [{
          command,
          timestamp: new Date().toLocaleTimeString(),
          success: true
        }, ...prev.slice(0, 9)]); // Keep last 10 commands
        
        setCommand('');
      } else {
        addToast({
          title: 'Error',
          description: result.error || 'Failed to execute command',
          variant: 'error'
        });
        
        setExecutionHistory(prev => [{
          command,
          timestamp: new Date().toLocaleTimeString(),
          success: false
        }, ...prev.slice(0, 9)]);
      }
    } catch (error) {
      console.error('Failed to execute command:', error);
      addToast({
        title: 'Error',
        description: 'Failed to execute command',
        variant: 'error'
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCloseSession = async () => {
    try {
      const result = await window.electronAPI.automation.closeSession();
      
      if (result) {
        addToast({
          title: 'Success',
          description: 'Session closed successfully',
          variant: 'success'
        });
        setSessionStatus({ status: 'no-session' });
      } else {
        addToast({
          title: 'Error',
          description: 'Failed to close session',
          variant: 'error'
        });
      }
    } catch (error) {
      console.error('Failed to close session:', error);
      addToast({
        title: 'Error',
        description: 'Failed to close session',
        variant: 'error'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 dark:text-green-400';
      case 'closed': return 'text-slate-600 dark:text-slate-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />;
      case 'closed': return <div className="w-2 h-2 bg-slate-400 rounded-full" />;
      case 'error': return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      default: return <div className="w-2 h-2 bg-slate-400 rounded-full" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Browser Automation
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Automate Bolt.new interactions for seamless project implementation
        </p>
      </div>

      {/* Session Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Session Status</span>
          </CardTitle>
          <CardDescription>
            Current browser automation session information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getStatusIcon(sessionStatus.status)}
              <div>
                <p className={`font-medium ${getStatusColor(sessionStatus.status)}`}>
                  {sessionStatus.status === 'no-session' && 'No Active Session'}
                  {sessionStatus.status === 'active' && 'Session Active'}
                  {sessionStatus.status === 'closed' && 'Session Closed'}
                  {sessionStatus.status === 'error' && 'Session Error'}
                </p>
                {sessionStatus.sessionId && (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Session ID: {sessionStatus.sessionId}
                  </p>
                )}
                {sessionStatus.startTime && (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Started: {new Date(sessionStatus.startTime).toLocaleString()}
                  </p>
                )}
                {sessionStatus.error && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Error: {sessionStatus.error}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {sessionStatus.status === 'no-session' ? (
                <Button
                  onClick={handleOpenBoltNew}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Opening...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Open Bolt.new
                    </>
                  )}
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={checkSessionStatus}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleCloseSession}
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Close Session
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Command Execution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Command Execution</span>
          </CardTitle>
          <CardDescription>
            Execute commands in the active Bolt.new session
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter your Bolt.new command..."
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleExecuteCommand()}
              disabled={sessionStatus.status !== 'active'}
              className="flex-1"
            />
            <Button
              onClick={handleExecuteCommand}
              disabled={sessionStatus.status !== 'active' || isExecuting}
            >
              {isExecuting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Execute
                </>
              )}
            </Button>
          </div>

          {sessionStatus.status !== 'active' && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Open a Bolt.new session to execute commands
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Execution History */}
      <Card>
        <CardHeader>
          <CardTitle>Execution History</CardTitle>
          <CardDescription>
            Recent command executions and their results
          </CardDescription>
        </CardHeader>
        <CardContent>
          {executionHistory.length === 0 ? (
            <div className="text-center py-8">
              <Globe className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                No commands executed yet
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Execute your first command to see the history
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {executionHistory.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    item.success ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {item.command}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {item.timestamp} • {item.success ? 'Success' : 'Failed'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Commands */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Commands</CardTitle>
          <CardDescription>
            Common commands for Bolt.new automation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Create a modern React TypeScript application with TailwindCSS',
              'Add a responsive navigation bar with dark mode toggle',
              'Implement a dashboard with charts and data visualization',
              'Create a user authentication system with login/signup',
              'Add a contact form with validation and email integration',
              'Implement a blog system with markdown support'
            ].map((quickCommand, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-left h-auto p-4 justify-start"
                onClick={() => setCommand(quickCommand)}
                disabled={sessionStatus.status !== 'active'}
              >
                <div>
                  <p className="text-sm font-medium">{quickCommand}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}