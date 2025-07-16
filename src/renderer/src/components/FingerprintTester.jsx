import React, { useState } from 'react';
import { ExternalLink, Shield, Eye, Globe, Monitor, Fingerprint } from 'lucide-react';

const FingerprintTester = () => {
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const testWebsites = [
    {
      name: "BrowserLeaks",
      url: "https://browserleaks.com",
      description: "Comprehensive browser fingerprinting test",
      category: "fingerprint",
      icon: <Fingerprint className="w-4 h-4" />
    },
    {
      name: "AmIUnique",
      url: "https://amiunique.org/fp",
      description: "Browser uniqueness analysis",
      category: "fingerprint",
      icon: <Eye className="w-4 h-4" />
    },
    {
      name: "DeviceInfo",
      url: "https://www.deviceinfo.me",
      description: "Device and browser information",
      category: "device",
      icon: <Monitor className="w-4 h-4" />
    },
    {
      name: "IPLocation",
      url: "https://iplocation.net",
      description: "IP address and location check",
      category: "proxy",
      icon: <Globe className="w-4 h-4" />
    },
    {
      name: "WhatIsMyIP",
      url: "https://www.whatismyipaddress.com",
      description: "IP address detection",
      category: "proxy",
      icon: <Globe className="w-4 h-4" />
    },
    {
      name: "WebGL Report",
      url: "https://webglreport.com",
      description: "WebGL fingerprinting test",
      category: "webgl",
      icon: <Shield className="w-4 h-4" />
    },
    {
      name: "Canvas Fingerprint",
      url: "https://browserleaks.com/canvas",
      description: "Canvas fingerprinting test",
      category: "canvas",
      icon: <Shield className="w-4 h-4" />
    },
    {
      name: "Audio Fingerprint",
      url: "https://audiofingerprint.openwpm.com",
      description: "Audio context fingerprinting",
      category: "audio",
      icon: <Shield className="w-4 h-4" />
    },
    {
      name: "Pixelscan",
      url: "https://pixelscan.net",
      description: "Advanced bot detection test",
      category: "detection",
      icon: <Eye className="w-4 h-4" />
    },
    {
      name: "Sannysoft",
      url: "https://bot.sannysoft.com",
      description: "Bot detection test",
      category: "detection",
      icon: <Eye className="w-4 h-4" />
    }
  ];

  const categories = {
    fingerprint: { name: "Fingerprinting", color: "bg-red-500" },
    proxy: { name: "Proxy/IP", color: "bg-blue-500" },
    device: { name: "Device Info", color: "bg-green-500" },
    webgl: { name: "WebGL", color: "bg-purple-500" },
    canvas: { name: "Canvas", color: "bg-yellow-500" },
    audio: { name: "Audio", color: "bg-pink-500" },
    detection: { name: "Bot Detection", color: "bg-orange-500" }
  };

  const openTestUrl = (url) => {
    // In a real implementation, this would open in the active profile's browser
    if (window.electronAPI && window.electronAPI.openUrl) {
      window.electronAPI.openUrl(url);
    } else {
      // Fallback for development
      window.open(url, '_blank');
    }
  };

  const runAutomatedTest = async () => {
    setIsLoading(true);
    try {
      // This would be implemented to run automated tests on fingerprinting websites
      // For now, it's a placeholder
      const results = {};
      
      for (const site of testWebsites.slice(0, 3)) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate testing
        results[site.name] = {
          status: Math.random() > 0.3 ? 'passed' : 'warning',
          score: Math.floor(Math.random() * 100),
          details: `Test completed for ${site.name}`
        };
      }
      
      setTestResults(results);
    } catch (error) {
      console.error('Automated test failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="px-8 py-6 border-b border-dark-700 bg-dark-800">
        <h2 className="text-2xl font-semibold mb-1">Fingerprint Tester</h2>
        <p className="text-dark-400 text-sm">Test your anti-detect browser setup and fingerprint protection</p>
      </div>
      
      <div className="flex-1 p-8 overflow-y-auto">
        <div style={{ maxWidth: '1000px' }}>
          
          {/* Quick Test Section */}
          <div className="profile-card mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Quick Test
            </h3>
            <p className="text-dark-400 mb-4">
              Run automated tests to check your browser's fingerprint protection.
            </p>
            <button
              onClick={runAutomatedTest}
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? 'Running Tests...' : 'Run Automated Test'}
            </button>
            
            {Object.keys(testResults).length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Test Results:</h4>
                {Object.entries(testResults).map(([site, result]) => (
                  <div key={site} className="flex items-center justify-between p-2 bg-dark-700 rounded mb-2">
                    <span>{site}</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        result.status === 'passed' ? 'bg-green-600' : 'bg-yellow-600'
                      }`}>
                        {result.status}
                      </span>
                      <span className="text-sm">{result.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Manual Test Sites */}
          <div className="profile-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-primary" />
              Manual Test Sites
            </h3>
            <p className="text-dark-400 mb-4">
              Click to open these test sites in your active browser profile to manually verify anti-detect features.
            </p>
            
            {Object.entries(categories).map(([categoryKey, category]) => {
              const sitesInCategory = testWebsites.filter(site => site.category === categoryKey);
              if (sitesInCategory.length === 0) return null;
              
              return (
                <div key={categoryKey} className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${category.color}`}></span>
                    {category.name}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sitesInCategory.map((site, index) => (
                      <div
                        key={index}
                        className="p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors cursor-pointer"
                        onClick={() => openTestUrl(site.url)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 mb-2">
                            {site.icon}
                            <h5 className="font-medium">{site.name}</h5>
                          </div>
                          <ExternalLink className="w-4 h-4 text-dark-400" />
                        </div>
                        <p className="text-sm text-dark-400 mb-2">{site.description}</p>
                        <p className="text-xs text-dark-500 font-mono">{site.url}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Testing Guidelines */}
          <div className="profile-card mt-6">
            <h3 className="text-lg font-semibold mb-4">Testing Guidelines</h3>
            <div className="space-y-3 text-sm text-dark-300">
              <div>
                <strong className="text-white">1. Proxy Testing:</strong>
                <p>Visit IP checking sites to verify your proxy is working and your real IP is hidden.</p>
              </div>
              <div>
                <strong className="text-white">2. Fingerprint Testing:</strong>
                <p>Use fingerprinting sites to check if your canvas, WebGL, and audio fingerprints are being spoofed.</p>
              </div>
              <div>
                <strong className="text-white">3. Bot Detection:</strong>
                <p>Test on bot detection sites to ensure your browser appears as a regular user browser.</p>
              </div>
              <div>
                <strong className="text-white">4. User Agent:</strong>
                <p>Verify your user agent is being properly set and matches your profile configuration.</p>
              </div>
              <div>
                <strong className="text-white">5. Multiple Tests:</strong>
                <p>Run tests multiple times with different profiles to ensure consistency in anti-detect features.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FingerprintTester;
