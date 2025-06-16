import React, { useState } from 'react';
import { List, FileText, Plus, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useToast } from '../hooks/useToast';

export function FeatureDocumentation() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [requirements, setRequirements] = useState('');
  const [generatedDocs, setGeneratedDocs] = useState('');
  const { addToast } = useToast();

  const handleGenerateDocs = async () => {
    if (!requirements.trim()) {
      addToast({
        title: 'Validation Error',
        description: 'Please enter project requirements',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsGenerating(true);
      
      // Mock generation for now - replace with actual implementation
      const mockDocs = `# Feature Documentation

## Project Requirements Analysis

Based on the provided requirements:
${requirements}

## Extracted Features

### Core Features
- User authentication and authorization
- Data management and storage
- User interface and experience
- Security and privacy controls

### Additional Features
- Performance optimization
- Mobile responsiveness
- API integration
- Testing and quality assurance

## Implementation Priority

1. **High Priority**: Core functionality and security
2. **Medium Priority**: User experience enhancements
3. **Low Priority**: Advanced features and optimizations

## Dependency Mapping

- Authentication → User Management
- Data Storage → API Layer
- UI Components → User Experience
- Security → All Features

## Technical Specifications

- Framework: React with TypeScript
- State Management: Zustand
- Styling: TailwindCSS
- Testing: Jest and React Testing Library
- Build Tool: Vite

Generated on: ${new Date().toLocaleString()}
`;

      setGeneratedDocs(mockDocs);
      addToast({
        title: 'Success',
        description: 'Feature documentation generated successfully'
      });
    } catch (error) {
      console.error('Failed to generate docs:', error);
      addToast({
        title: 'Error',
        description: 'Failed to generate feature documentation',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadDocs = () => {
    if (!generatedDocs.trim()) {
      addToast({
        title: 'Error',
        description: 'No documentation to download',
        variant: 'destructive'
      });
      return;
    }

    const blob = new Blob([generatedDocs], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FEATURES.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addToast({
      title: 'Success',
      description: 'Documentation downloaded as FEATURES.md'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Feature Documentation
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Generate comprehensive feature documentation from project requirements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Project Requirements</span>
            </CardTitle>
            <CardDescription>
              Enter your high-level project goals and requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Requirements Description
              </label>
              <textarea
                className="w-full min-h-[300px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                placeholder="Describe your project requirements in detail. For example:

- User authentication system
- Dashboard for data visualization  
- Mobile-responsive design
- Real-time notifications
- Admin panel for management
- Integration with third-party APIs"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleGenerateDocs} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Generating Documentation...
                </>
              ) : (
                <>
                  <List className="w-4 h-4 mr-2" />
                  Generate FEATURES.md
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Documentation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Generated Documentation</span>
            </CardTitle>
            <CardDescription>
              Structured feature documentation with priorities and dependencies
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedDocs ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadDocs}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 max-h-[600px] overflow-y-auto">
                  <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {generatedDocs}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <List className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 mb-2">
                  No documentation generated yet
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  Enter your project requirements and click "Generate FEATURES.md" to create documentation
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg inline-block mb-4">
              <List className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              Requirement Extraction
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Automatically parse and structure your requirements into actionable features
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg inline-block mb-4">
              <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              Priority Assignment
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Intelligent prioritization of features based on complexity and importance
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg inline-block mb-4">
              <Plus className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              Dependency Mapping
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Identify and document feature dependencies for proper implementation order
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}