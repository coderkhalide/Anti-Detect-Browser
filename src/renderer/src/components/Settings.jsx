import React, { useState } from 'react';
import { Save, Shield, Globe, Monitor, Lock } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    autoStartProfiles: false,
    closeToTray: true,
    enableLogging: true,
    defaultResolution: '1920x1080',
    maxConcurrentProfiles: 5,
    useHardwareAcceleration: true,
    enableFingerprinting: true,
    canvasFingerprinting: 'noise',
    webglFingerprinting: 'block',
    audioFingerprinting: 'noise',
    fontFingerprinting: 'block',
    autoUpdateUserAgents: true,
    clearDataOnExit: false,
    encryptProfiles: true
  });

  const handleSave = () => {
    // In a real app, this would save to electron store
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <>
      <div className="px-8 py-6 border-b border-dark-700 bg-dark-800">
        <h2 className="text-2xl font-semibold mb-1">Settings</h2>
        <p className="text-dark-400 text-sm">Configure application preferences and security settings</p>
      </div>
      <div className="flex-1 p-8 overflow-y-auto">
        <div style={{ maxWidth: '800px' }}>
          
          {/* General Settings */}
          <div className="profile-card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <Monitor style={{ color: '#0d7377' }} />
              <h3>General Settings</h3>
            </div>
            
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.autoStartProfiles}
                  onChange={(e) => handleChange('autoStartProfiles', e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                Auto-start recent profiles on launch
              </label>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.closeToTray}
                  onChange={(e) => handleChange('closeToTray', e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                Minimize to system tray when closed
              </label>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.enableLogging}
                  onChange={(e) => handleChange('enableLogging', e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                Enable debug logging
              </label>
            </div>

            <div className="form-group">
              <label>Default screen resolution</label>
              <select
                value={settings.defaultResolution}
                onChange={(e) => handleChange('defaultResolution', e.target.value)}
              >
                <option value="1920x1080">1920x1080</option>
                <option value="1366x768">1366x768</option>
                <option value="1440x900">1440x900</option>
                <option value="1280x720">1280x720</option>
                <option value="1536x864">1536x864</option>
                <option value="1600x900">1600x900</option>
              </select>
            </div>

            <div className="form-group">
              <label>Maximum concurrent profiles</label>
              <input
                type="number"
                min="1"
                max="20"
                value={settings.maxConcurrentProfiles}
                onChange={(e) => handleChange('maxConcurrentProfiles', parseInt(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.useHardwareAcceleration}
                  onChange={(e) => handleChange('useHardwareAcceleration', e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                Use hardware acceleration
              </label>
            </div>
          </div>

          {/* Fingerprinting Settings */}
          <div className="profile-card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <Shield style={{ color: '#0d7377' }} />
              <h3>Anti-Fingerprinting</h3>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.enableFingerprinting}
                  onChange={(e) => handleChange('enableFingerprinting', e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                Enable fingerprint protection
              </label>
            </div>

            <div className="form-group">
              <label>Canvas fingerprinting protection</label>
              <select
                value={settings.canvasFingerprinting}
                onChange={(e) => handleChange('canvasFingerprinting', e.target.value)}
                disabled={!settings.enableFingerprinting}
              >
                <option value="block">Block</option>
                <option value="noise">Add noise</option>
                <option value="allow">Allow</option>
              </select>
            </div>

            <div className="form-group">
              <label>WebGL fingerprinting protection</label>
              <select
                value={settings.webglFingerprinting}
                onChange={(e) => handleChange('webglFingerprinting', e.target.value)}
                disabled={!settings.enableFingerprinting}
              >
                <option value="block">Block</option>
                <option value="noise">Add noise</option>
                <option value="allow">Allow</option>
              </select>
            </div>

            <div className="form-group">
              <label>Audio fingerprinting protection</label>
              <select
                value={settings.audioFingerprinting}
                onChange={(e) => handleChange('audioFingerprinting', e.target.value)}
                disabled={!settings.enableFingerprinting}
              >
                <option value="block">Block</option>
                <option value="noise">Add noise</option>
                <option value="allow">Allow</option>
              </select>
            </div>

            <div className="form-group">
              <label>Font fingerprinting protection</label>
              <select
                value={settings.fontFingerprinting}
                onChange={(e) => handleChange('fontFingerprinting', e.target.value)}
                disabled={!settings.enableFingerprinting}
              >
                <option value="block">Block</option>
                <option value="allow">Allow</option>
              </select>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="profile-card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <Lock style={{ color: '#0d7377' }} />
              <h3>Privacy & Security</h3>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.autoUpdateUserAgents}
                  onChange={(e) => handleChange('autoUpdateUserAgents', e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                Automatically update user agents
              </label>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.clearDataOnExit}
                  onChange={(e) => handleChange('clearDataOnExit', e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                Clear browsing data on exit
              </label>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.encryptProfiles}
                  onChange={(e) => handleChange('encryptProfiles', e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                Encrypt stored profiles
              </label>
            </div>
          </div>

          {/* Proxy Settings */}
          <div className="profile-card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <Globe style={{ color: '#0d7377' }} />
              <h3>Network & Proxy</h3>
            </div>

            <div className="profile-detail" style={{ padding: '15px', backgroundColor: '#404040', borderRadius: '6px' }}>
              <strong>Note:</strong> Proxy settings are configured per profile in the Profiles section. 
              Global proxy settings will be available in future updates.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button className="btn btn-secondary">
              Reset to Defaults
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              <Save size={16} />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
