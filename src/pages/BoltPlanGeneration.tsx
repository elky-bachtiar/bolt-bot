import React, { useState } from 'react';
import { Zap, FileText, Plus, Download, CheckSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useToast } from '../hooks/useToast';

interface PlanData {
  projectName: string;
  features: string;
  techStack: string;
  complexity: 'simple' | 'moderate' | 'complex';
}

export function BoltPlanGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [planData, setPlanData] = useState<PlanData>({
    projectName: '',
    features: '',
    techStack: '',
    complexity: 'moderate'
  });
  const [generatedPlan, setGeneratedPlan] = useState('');
  const { addToast } = useToast();

  const handleInputChange = (field: keyof PlanData, value: string) => {
    setPlanData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGeneratePlan = async () => {
    if (!planData.projectName.trim() || !planData.features.trim()) {
      addToast({
        title: 'Validation Error',
        description: 'Please provide project name and features',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsGenerating(true);
      
      // Mock generation for now - replace with actual implementation
      const mockPlan = `# Bolt Implementation Plan: ${planData.projectName}

## Project Overview
- **Name**: ${planData.projectName}
- **Complexity**: ${planData.complexity}
- **Tech Stack**: ${planData.techStack || 'React, TypeScript, Tailwind CSS'}

## Features to Implement
${planData.features}

## Implementation Checklist

### Phase 1: Project Setup
- [ ] Initialize Vite project with React and TypeScript
- [ ] Set up TailwindCSS for styling
- [ ] Configure ESLint and Prettier
- [ ] Set up basic folder structure
- [ ] Create initial README.md

### Phase 2: Core Features
- [ ] Implement basic UI layout and navigation
- [ ] Set up state management (Zustand/Context)
- [ ] Create component library for common UI elements
- [ ] Implement core business logic
- [ ] Add proper error handling

### Phase 3: Advanced Features
- [ ] Add responsive design breakpoints
- [ ] Implement animations and micro-interactions
- [ ] Add loading states and optimistic updates
- [ ] Implement proper form validation
- [ ] Add accessibility features (ARIA labels, keyboard navigation)

### Phase 4: Testing & Polish
- [ ] Write unit tests for core components
- [ ] Add integration tests for user flows
- [ ] Perform cross-browser testing
- [ ] Optimize performance and bundle size
- [ ] Final UI polish and design refinements

## Bolt.new Commands

### Initial Setup
\`\`\`
Create a modern React TypeScript application with the following structure:
- Responsive design using TailwindCSS
- Component-based architecture
- State management with Zustand
- Proper error handling and loading states
- Accessibility-first approach
\`\`\`

### Feature Implementation
\`\`\`
Implement the following features with attention to:
${planData.features}

Ensure each feature includes:
- Proper TypeScript types
- Error handling
- Loading states
- Responsive design
- Accessibility features
\`\`\`

## Knowledge Base

### Key Patterns
- Use functional components with hooks
- Implement proper error boundaries
- Follow React best practices for performance
- Use semantic HTML elements
- Implement proper ARIA attributes

### Common Pitfalls
- Avoid prop drilling - use context or state management
- Don't forget loading and error states
- Ensure proper cleanup in useEffect
- Validate all user inputs
- Test on multiple devices and browsers

Generated on: ${new Date().toLocaleString()}
`;

      setGeneratedPlan(mockPlan);
      addToast({
        title: 'Success',
        description: 'Bolt implementation plan generated successfully'
      });
    } catch (error) {
      console.error('Failed to generate plan:', error);
      addToast({
        title: 'Error',
        description: 'Failed to generate Bolt plan',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPlan = () => {
    if (!generatedPlan.trim()) {
      addToast({
        title: 'Error',
        description: 'No plan to download',
        variant: 'destructive'
      });
      return;
    }

    const blob = new Blob([generatedPlan], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${planData.projectName || 'project'}-BOLT-PLAN.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addToast({
      title: 'Success',
      description: 'Plan downloaded successfully'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Bolt Plan Generation
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Generate comprehensive implementation plans optimized for Bolt.new
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Plan Configuration</span>
            </CardTitle>
            <CardDescription>
              Configure your project details for optimized Bolt.new implementation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Project Name
              </label>
              <input
                type="text"
                className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                placeholder="My Awesome App"
                value={planData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Features & Requirements
              </label>
              <textarea
                className="w-full min-h-[150px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                placeholder="Describe the features you want to implement:
- User authentication
- Dashboard with charts
- Real-time chat
- File upload functionality"
                value={planData.features}
                onChange={(e) => handleInputChange('features', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Technology Stack (Optional)
              </label>
              <input
                type="text"
                className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                placeholder="React, TypeScript, Tailwind CSS, Zustand"
                value={planData.techStack}
                onChange={(e) => handleInputChange('techStack', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Project Complexity
              </label>
              <select
                className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                value={planData.complexity}
                onChange={(e) => handleInputChange('complexity', e.target.value as PlanData['complexity'])}
              >
                <option value="simple">Simple (Basic features, minimal complexity)</option>
                <option value="moderate">Moderate (Multiple features, some integrations)</option>
                <option value="complex">Complex (Advanced features, complex logic)</option>
              </select>
            </div>

            <Button 
              onClick={handleGeneratePlan} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Bolt Plan
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Implementation Plan</span>
            </CardTitle>
            <CardDescription>
              Ready-to-use plan with checklists and Bolt.new commands
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedPlan ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadPlan}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 max-h-[600px] overflow-y-auto">
                  <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {generatedPlan}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Zap className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 mb-2">
                  No plan generated yet
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  Configure your project and click "Generate Bolt Plan" to create an implementation plan
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Plan Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-lg inline-block mb-4">
              <CheckSquare className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              Implementation Checklist
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Detailed task breakdown with checkboxes for tracking progress
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg inline-block mb-4">
              <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              Bolt.new Commands
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Ready-to-use prompts optimized for Bolt.new implementation
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg inline-block mb-4">
              <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              Knowledge Base
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Best practices, patterns, and common pitfalls to avoid
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}