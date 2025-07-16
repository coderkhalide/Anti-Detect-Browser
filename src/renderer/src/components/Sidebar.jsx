import React from 'react';
import { Home, User, Globe, Users, Settings, Shield, TestTube } from 'lucide-react';

const Sidebar = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'profiles', label: 'Profiles', icon: User },
    { id: 'proxies', label: 'Proxies', icon: Globe },
    { id: 'proxy-tester', label: 'Proxy Tester', icon: TestTube },
    { id: 'tester', label: 'Fingerprint Tester', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-dark-800 border-r border-dark-700 flex flex-col">
      <div className="p-6 border-b border-dark-700">
        <h1 className="text-lg font-semibold text-white">Anti-Detect Browser</h1>
      </div>
      <nav className="flex-1 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`sidebar-nav-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
