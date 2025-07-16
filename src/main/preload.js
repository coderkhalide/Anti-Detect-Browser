const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Profile management
  getProfiles: () => ipcRenderer.invoke('get-profiles'),
  createProfile: (profileData) => ipcRenderer.invoke('create-profile', profileData),
  updateProfile: (profileId, profileData) => ipcRenderer.invoke('update-profile', profileId, profileData),
  deleteProfile: (profileId) => ipcRenderer.invoke('delete-profile', profileId),
  
  // Proxy management
  getProxies: () => ipcRenderer.invoke('get-proxies'),
  createProxy: (proxyData) => ipcRenderer.invoke('create-proxy', proxyData),
  updateProxy: (proxyId, proxyData) => ipcRenderer.invoke('update-proxy', proxyId, proxyData),
  deleteProxy: (proxyId) => ipcRenderer.invoke('delete-proxy', proxyId),
  testProxy: (proxyId) => ipcRenderer.invoke('test-proxy', proxyId),
  
  // Browser launching
  launchProfile: (profileId) => ipcRenderer.invoke('launch-profile', profileId),
  stopProfile: (profileId) => ipcRenderer.invoke('stop-profile', profileId),
  
  // URL opening in active profiles
  openUrl: (url) => ipcRenderer.invoke('open-url', url),
  
  // System info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Listen to events
  onProfileStatusChange: (callback) => {
    ipcRenderer.on('profile-status-changed', callback);
    return () => ipcRenderer.removeListener('profile-status-changed', callback);
  }
});
