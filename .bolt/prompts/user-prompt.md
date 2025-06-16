# User Prompt - Bolt Bot Electron UI Implementation

**Date**: 2025-06-16
**Time**: Current Session

## Original Prompt

Always copy my prompt to .bolt/prompts directory using a md file.

Always copy your answer and thoughts to .bolt/prompts/answers directory using a md file including prompt question, your answer and the date and time.

For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.

By default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.

Use icons from lucide-react for logos.

# Bolt Bot Electron UI Implementation Command

## Overview
This command will implement a complete Electron-based UI for the Bolt Bot application, which is an AI-powered project planning assistant that automates the initialization and setup of new projects. The implementation will incorporate all core features including API key management, secure credential management, project context generation, feature documentation, Bolt plan generation, and browser automation.

## Implementation Command

```
Bolt Bot Electron UI Implementation

Create a comprehensive Electron app for Bolt Bot with the following specifications:

1. Project Structure & Setup:
   - Create a TypeScript-based Electron application
   - Implement a modern UI using React and TailwindCSS for the frontend
   - Configure secure IPC communication between main and renderer processes
   - Create a responsive layout that adapts to different screen sizes

2. Main Application Components:
   - Implement main process setup with proper security considerations
   - Create a renderer process with React and TypeScript
   - Set up development tools and hot reloading for efficiency
   - Configure build processes for production deployment
   - Implement proper error handling and logging throughout

3. Core Features Implementation:

   3.1 API Key Management:
   - Create UI components for secure API key input and storage
   - Implement integration with HashiCorp Vault for secure key storage
   - Design key rotation and expiration management interface
   - Build usage tracking displays and notifications
   - Implement role-based access controls for key operations

   3.2 Secure Credential Management:
   - Build client-side encryption/decryption utilities
   - Implement user-specific encryption with envelope encryption
   - Create zero-knowledge architecture for credential management
   - Design secure key exchange mechanisms using asymmetric cryptography
   - Implement tenant isolation for multi-tenant security
   - Add automated key rotation interface with credential re-encryption

   3.3 Project Context Generation:
   - Develop interface for CLAUDE.md creation and editing
   - Implement template-based document generation system
   - Create project metadata extraction and management
   - Design version control integration for context documents
   - Build template management system with customization options
   - Implement AI-powered content generation preview

   3.4 Feature Documentation Generator:
   - Create FEATURE.md generation interface
   - Implement requirement extraction from high-level goals
   - Build roadmap integration and timeline visualization
   - Design priority assignment and filtering mechanisms
   - Implement dependency mapping visualization
   - Add real-time document preview and editing capabilities

   3.5 Bolt Plan Generation:
   - Implement prompt creation and optimization interface
   - Build implementation checklist generator with visualization
   - Create command generation and validation system
   - Implement knowledge base constructor and browser
   - Design integrated documentation viewer

   3.6 Browser Automation:
   - Integrate Playwright for headless browser automation
   - Build Bolt.new interaction components
   - Implement command input automation with validation
   - Create session management and security controls
   - Design implementation progress tracking visualization
   - Implement error detection and recovery mechanisms

4. UI/UX Design:
   - Implement a modern, clean interface with dark/light mode support
   - Theme Toggle, only toggle between dark/light without popup
   - Create consistent component library using TailwindCSS
   - Design intuitive navigation with proper information hierarchy
   - Build responsive layouts for all screen sizes
   - Implement proper loading states and error handling UI
   - Add subtle animations and transitions for better UX
   - Create comprehensive form validation with helpful error messages
   - Add Footer and Footer badge with Bolt.new Lightning Icon

[Additional detailed specifications continue...]
```

## File Attachments Referenced
- BOLT_BOT.md
- FEATURES.md  
- 01_API_KEY_MANAGEMENT.md
- 02_PROJECT_CONTEXT_GENERATION.md
- 03_FEATURE_DOCUMENTATION.md