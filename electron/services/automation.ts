import { Browser, Page, chromium } from 'playwright';

interface AutomationSession {
  id: string;
  browser: Browser;
  page: Page;
  url: string;
  status: 'active' | 'closed' | 'error';
  startTime: Date;
}

class AutomationService {
  private sessions: Map<string, AutomationSession> = new Map();

  async openBoltNew(): Promise<AutomationSession> {
    try {
      const browser = await chromium.launch({
        headless: false, // Show browser for user interaction
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });

      const page = await browser.newPage();
      
      // Set user agent and viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

      // Navigate to Bolt.new
      await page.goto('https://bolt.new', { waitUntil: 'networkidle' });

      const session: AutomationSession = {
        id: `session-${Date.now()}`,
        browser,
        page,
        url: 'https://bolt.new',
        status: 'active',
        startTime: new Date()
      };

      this.sessions.set(session.id, session);
      
      // Setup page event listeners
      page.on('close', () => {
        session.status = 'closed';
        this.sessions.delete(session.id);
      });

      page.on('crash', () => {
        session.status = 'error';
        this.cleanup(session.id);
      });

      console.log(`Bolt.new session ${session.id} opened successfully`);
      return session;
    } catch (error) {
      console.error('Failed to open Bolt.new:', error);
      throw error;
    }
  }

  async executeCommand(command: string, sessionId?: string): Promise<any> {
    try {
      // Get the most recent active session if no sessionId provided
      const session = sessionId ? 
        this.sessions.get(sessionId) : 
        Array.from(this.sessions.values()).find(s => s.status === 'active');

      if (!session) {
        throw new Error('No active browser session found');
      }

      const { page } = session;

      // Wait for the chat input to be ready
      await page.waitForSelector('[data-testid="chat-input"], textarea, input[type="text"]', { timeout: 10000 });

      // Find the chat input field
      const chatInput = await page.locator('[data-testid="chat-input"], textarea, input[type="text"]').first();
      
      // Clear existing content and type the command
      await chatInput.click();
      await page.keyboard.selectAll();
      await chatInput.fill(command);

      // Submit the command
      await page.keyboard.press('Enter');

      // Wait for response to start appearing
      await page.waitForTimeout(2000);

      console.log(`Command executed successfully in session ${session.id}`);
      return {
        sessionId: session.id,
        command,
        timestamp: new Date(),
        success: true
      };
    } catch (error) {
      console.error('Failed to execute command:', error);
      throw error;
    }
  }

  async getSessionStatus(sessionId?: string): Promise<any> {
    const session = sessionId ? 
      this.sessions.get(sessionId) : 
      Array.from(this.sessions.values()).find(s => s.status === 'active');

    if (!session) {
      return { status: 'no-session' };
    }

    try {
      // Check if page is still responsive
      await session.page.evaluate(() => document.title);
      
      return {
        sessionId: session.id,
        status: session.status,
        url: session.url,
        startTime: session.startTime,
        isResponsive: true
      };
    } catch (error) {
      session.status = 'error';
      return {
        sessionId: session.id,
        status: 'error',
        error: (error as Error).message,
        isResponsive: false
      };
    }
  }

  async closeSession(sessionId?: string): Promise<boolean> {
    try {
      const session = sessionId ? 
        this.sessions.get(sessionId) : 
        Array.from(this.sessions.values()).find(s => s.status === 'active');

      if (!session) {
        return false;
      }

      await session.browser.close();
      this.sessions.delete(session.id);
      
      console.log(`Session ${session.id} closed successfully`);
      return true;
    } catch (error) {
      console.error('Failed to close session:', error);
      return false;
    }
  }

  async trackProgress(sessionId?: string): Promise<any> {
    const session = sessionId ? 
      this.sessions.get(sessionId) : 
      Array.from(this.sessions.values()).find(s => s.status === 'active');

    if (!session) {
      return { error: 'No active session' };
    }

    try {
      // Extract progress information from the page
      const progress = await session.page.evaluate(() => {
        // Look for progress indicators, loading states, etc.
        const loadingElements = document.querySelectorAll('[data-loading], .loading, .spinner');
        const progressBars = document.querySelectorAll('progress, [role="progressbar"]');
        const statusText = document.querySelector('[data-status]')?.textContent;

        return {
          isLoading: loadingElements.length > 0,
          progressBars: progressBars.length,
          statusText: statusText || null,
          timestamp: new Date().toISOString()
        };
      });

      return {
        sessionId: session.id,
        progress,
        success: true
      };
    } catch (error) {
      console.error('Failed to track progress:', error);
      return {
        sessionId: session.id,
        error: (error as Error).message,
        success: false
      };
    }
  }

  private async cleanup(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      try {
        await session.browser.close();
      } catch (error) {
        console.error('Error during session cleanup:', error);
      }
      this.sessions.delete(sessionId);
    }
  }

  async shutdown(): Promise<void> {
    console.log('Shutting down automation service...');
    
    for (const session of this.sessions.values()) {
      await this.cleanup(session.id);
    }
    
    this.sessions.clear();
    console.log('Automation service shutdown complete');
  }
}

const automationService = new AutomationService();

export { automationService };