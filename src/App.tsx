import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/Toaster';
import { ThemeProvider } from './providers/ThemeProvider';
import { AppStateProvider } from './providers/AppStateProvider';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { KeyManagement } from './pages/KeyManagement';
import { ProjectContext } from './pages/ProjectContext';
import { FeatureDocumentation } from './pages/FeatureDocumentation';
import { BoltPlanGeneration } from './pages/BoltPlanGeneration';
import { BrowserAutomation } from './pages/BrowserAutomation';
import { Settings } from './pages/Settings';

function App() {
  return (
    <ThemeProvider>
      <AppStateProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/keys" element={<KeyManagement />} />
                <Route path="/context" element={<ProjectContext />} />
                <Route path="/features" element={<FeatureDocumentation />} />
                <Route path="/bolt-plan" element={<BoltPlanGeneration />} />
                <Route path="/automation" element={<BrowserAutomation />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
            <Toaster />
          </div>
        </Router>
      </AppStateProvider>
    </ThemeProvider>
  );
}

export default App;