import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.jsx';
import ProfileManager from './components/ProfileManager.jsx';
import ProxyManager from './components/ProxyManager.jsx';
import Settings from './components/Settings.jsx';
import Home from './components/Home.jsx';
import FingerprintTester from './components/FingerprintTester.jsx';
import ProxyTester from './components/ProxyTester.jsx';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    // Load profiles on startup
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      if (window.electronAPI) {
        const loadedProfiles = await window.electronAPI.getProfiles();
        setProfiles(loadedProfiles);
      }
    } catch (error) {
      console.error('Failed to load profiles:', error);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <Home profiles={profiles} />;
      case 'profiles':
        return <ProfileManager profiles={profiles} onProfilesChange={loadProfiles} />;
      case 'proxies':
        return <ProxyManager />;
      case 'proxy-tester':
        return <ProxyTester />;
      case 'tester':
        return <FingerprintTester />;
      case 'settings':
        return <Settings />;
      default:
        return <Home profiles={profiles} />;
    }
  };

  return (
    <div className="flex h-screen bg-dark-900">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 flex flex-col">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;
