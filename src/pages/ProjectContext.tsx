import React, { useState, useEffect } from 'react';
import { FileText, Plus, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useToast } from '../hooks/useToast';
import { motion } from 'framer-motion';

interface ProjectData {
  name: string;
  description: string;
  type: 'web' | 'mobile' | 'backend' | 'fullstack';
  requirements: string;
  techStack: string;
  architecture: string;
}

export function ProjectContext() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContext, setGeneratedContext] = useState('');
  const [projectData, setProjectData] = useState<ProjectData>({
    name: '',
    description: '',
    type: 'web',
    requirements: '',
    techStack: '',
    architecture: ''
  });
  const { addToast } = useToast();

  const handleInputChange = (field: keyof ProjectData, value: string) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerateContext = async () => {
    if (!projectData.name.trim() || !projectData.description.trim() || !projectData.requirements.trim()) {
      addToast({
        title: 'Validation Error',
        description: 'Please fill in the required fields (name, description, requirements)',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsGenerating(true);
      
      const contextData = {
        ...projectData,
        techStack: projectData.techStack.split(',').map(tech => tech.trim()).filter(Boolean)
      };

      const result = await window.electronAPI.context.generateContext(contextData);
      
      if (result.success) {
        setGeneratedContext(result.context);
        addToast({
          title: 'Success',
          description: 'Project context generated successfully'
        });
      } else {
        addToast({
          title: 'Error',
          description: result.error || 'Failed to generate context',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Failed to generate context:', error);
      addToast({
        title: 'Error',
        description: 'Failed to generate project context',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveContext = async () => {
    if (!generatedContext.trim()) {
      addToast({
        title: 'Error',
        description: 'No context to save',
        variant: 'destructive'
      });
      return;
    }

    try {
      const contextId = `${projectData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      const result = await window.electronAPI.context.saveContext(contextId, generatedContext);
      
      if (result.success) {
        addToast({
          title: 'Success',
          description: 'Context saved successfully'
        });
      } else {
        addToast({
          title: 'Error',
          description: result.error || 'Failed to save context',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Failed to save context:', error);
      addToast({
        title: 'Error',
        description: 'Failed to save context',
        variant: 'destructive'
      });
    }
  };

  const handleDownloadContext = () => {
    if (!generatedContext.trim()) {
      addToast({
        title: 'Error',
        description: 'No context to download',
        variant: 'destructive'
      });
      return;
    }

    const blob = new Blob([generatedContext], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectData.name || 'project'}-CLAUDE.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addToast({
      title: 'Success',
      description: 'Context downloaded as CLAUDE.md'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Project Context Generation
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Generate AI-optimized CLAUDE.md documentation for your project
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Project Information</span>
            </CardTitle>
            <CardDescription>
              Provide details about your project to generate contextual documentation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Project Name *
              </label>
              <Input
                placeholder="My Awesome Project"
                value={projectData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Project Type
              </label>
              <select
                className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                value={projectData.type}
                onChange={(e) => handleInputChange('type', e.target.value as ProjectData['type'])}
              >
                <option value="web">Web Application</option>
                <option value="mobile">Mobile Application</option>
                <option value="backend">Backend Service</option>
                <option value="fullstack">Full Stack Application</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Description *
              </label>
              <textarea
                className="w-full min-h-[100px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                placeholder="Brief description of your project..."
                value={projectData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Requirements *
              </label>
              <textarea
                className="w-full min-h-[120px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                placeholder="Detailed project requirements and goals..."
                value={projectData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Technology Stack
              </label>
              <Input
                placeholder="React, TypeScript, Node.js, PostgreSQL (comma-separated)"
                value={projectData.techStack}
                onChange={(e) => handleInputChange('techStack', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Architecture
              </label>
              <Input
                placeholder="Microservices, REST API, etc."
                value={projectData.architecture}
                onChange={(e) => handleInputChange('architecture', e.target.value)}
              />
            </div>

            <Button 
              onClick={handleGenerateContext} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Generating Context...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate CLAUDE.md
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Context */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Generated Context</span>
            </CardTitle>
            <CardDescription>
              AI-optimized project documentation for Claude
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedContext ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveContext}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadContext}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 max-h-[600px] overflow-y-auto">
                  <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {generatedContext}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 mb-2">
                  No context generated yet
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  Fill in the project information and click "Generate CLAUDE.md" to create your context
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <h3 className="font-medium text-green-900 dark:text-green-200 mb-2">
                Context Generation Tips
              </h3>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <li>• Be specific in your requirements for better context generation</li>
                <li>• Include technical constraints and preferences</li>
                <li>• Mention any existing codebase or architectural decisions</li>
                <li>• Generated contexts are optimized for Claude API interactions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}