import fs from 'fs/promises';
import path from 'path';
import { app } from 'electron';

interface ProjectData {
  name: string;
  description: string;
  type: 'web' | 'mobile' | 'backend' | 'fullstack';
  requirements: string;
  techStack?: string[];
  architecture?: string;
}

interface ContextTemplate {
  type: string;
  template: string;
}

class ContextService {
  private contextPath: string;
  private templatesPath: string;

  constructor() {
    this.contextPath = path.join(app.getPath('userData'), 'contexts');
    this.templatesPath = path.join(app.getPath('userData'), 'templates');
  }

  async initialize(): Promise<void> {
    await fs.mkdir(this.contextPath, { recursive: true });
    await fs.mkdir(this.templatesPath, { recursive: true });
    await this.createDefaultTemplates();
  }

  private async createDefaultTemplates(): Promise<void> {
    const defaultTemplate = `# Project Context for Claude

## Project Overview
**Name**: {{projectName}}
**Type**: {{projectType}}
**Description**: {{projectDescription}}

## Requirements
{{requirements}}

## Technical Specifications
{{#if techStack}}
**Technology Stack**:
{{#each techStack}}
- {{this}}
{{/each}}
{{/if}}

{{#if architecture}}
**Architecture**: {{architecture}}
{{/if}}

## Development Guidelines
- Follow secure coding practices
- Implement comprehensive error handling
- Write maintainable, well-documented code
- Use TypeScript for type safety
- Follow the existing code style and patterns

## Quality Standards
- Maintain 85%+ test coverage
- Ensure responsive design for all screen sizes
- Implement proper accessibility features
- Follow security-first development principles

## Context for AI Assistance
This project requires careful attention to:
1. Security and data protection
2. Performance optimization
3. User experience design
4. Code maintainability
5. Testing and quality assurance

Please ensure all generated code follows these standards and integrates well with the existing codebase.
`;

    const templatePath = path.join(this.templatesPath, 'default.hbs');
    try {
      await fs.access(templatePath);
    } catch {
      await fs.writeFile(templatePath, defaultTemplate);
    }
  }

  async generateContext(projectData: ProjectData): Promise<string> {
    try {
      // Load template
      const templatePath = path.join(this.templatesPath, 'default.hbs');
      const templateContent = await fs.readFile(templatePath, 'utf8');

      // Simple template replacement (in production, use Handlebars)
      let context = templateContent
        .replace(/\{\{projectName\}\}/g, projectData.name)
        .replace(/\{\{projectType\}\}/g, projectData.type)
        .replace(/\{\{projectDescription\}\}/g, projectData.description)
        .replace(/\{\{requirements\}\}/g, projectData.requirements);

      // Handle tech stack
      if (projectData.techStack && projectData.techStack.length > 0) {
        const techStackList = projectData.techStack.map(tech => `- ${tech}`).join('\n');
        context = context.replace(/\{\{#if techStack\}\}[\s\S]*?\{\{\/if\}\}/g, 
          `**Technology Stack**:\n${techStackList}`);
      } else {
        context = context.replace(/\{\{#if techStack\}\}[\s\S]*?\{\{\/if\}\}/g, '');
      }

      // Handle architecture
      if (projectData.architecture) {
        context = context.replace(/\{\{#if architecture\}\}[\s\S]*?\{\{\/if\}\}/g, 
          `**Architecture**: ${projectData.architecture}`);
      } else {
        context = context.replace(/\{\{#if architecture\}\}[\s\S]*?\{\{\/if\}\}/g, '');
      }

      return context;
    } catch (error) {
      console.error('Failed to generate context:', error);
      throw error;
    }
  }

  async saveContext(contextId: string, content: string): Promise<void> {
    try {
      const contextFile = path.join(this.contextPath, `${contextId}.md`);
      await fs.writeFile(contextFile, content);
      console.log(`Context ${contextId} saved successfully`);
    } catch (error) {
      console.error(`Failed to save context ${contextId}:`, error);
      throw error;
    }
  }

  async loadContext(contextId: string): Promise<string | null> {
    try {
      const contextFile = path.join(this.contextPath, `${contextId}.md`);
      const content = await fs.readFile(contextFile, 'utf8');
      return content;
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        return null;
      }
      console.error(`Failed to load context ${contextId}:`, error);
      throw error;
    }
  }

  async listContexts(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.contextPath);
      return files
        .filter(file => file.endsWith('.md'))
        .map(file => file.replace('.md', ''));
    } catch (error) {
      console.error('Failed to list contexts:', error);
      throw error;
    }
  }

  async deleteContext(contextId: string): Promise<boolean> {
    try {
      const contextFile = path.join(this.contextPath, `${contextId}.md`);
      await fs.unlink(contextFile);
      return true;
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        return false;
      }
      console.error(`Failed to delete context ${contextId}:`, error);
      throw error;
    }
  }
}

const contextService = new ContextService();

export { contextService };