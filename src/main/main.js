const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';
const ProfileManager = require('./profileManager');
const ProxyManager = require('./proxyManager');
const BrowserLauncher = require('../automation/browserLauncher');
const https = require('https');
const http = require('http');


// Real proxy testing function
async function testProxyConnection(proxy) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const timeout = 15000; // 15 second timeout
    
    try {
      // Construct proxy URL
      let proxyUrl;
      if (proxy.type === 'socks5' || proxy.type === 'socks4') {
        proxyUrl = `${proxy.type}://`;
      } else {
        proxyUrl = 'http://';
      }
      
      if (proxy.username && proxy.password) {
        proxyUrl += `${proxy.username}:${proxy.password}@`;
      }
      proxyUrl += `${proxy.host}:${proxy.port}`;
      
      console.log(`Testing proxy: ${proxyUrl.replace(/:([^:@]+)@/, ':***@')}`); // Hide password in logs
      
      // Test with a simple HTTP request to httpbin.org which returns IP info
      const options = {
        hostname: 'httpbin.org',
        path: '/ip',
        method: 'GET',
        timeout: timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      };
      
      let agent;
      if (proxy.type === 'socks5' || proxy.type === 'socks4') {
        try {
          const { SocksProxyAgent } = require('socks-proxy-agent');
          agent = new SocksProxyAgent(proxyUrl);
        } catch (error) {
          resolve({
            success: false,
            error: 'SOCKS proxy support not available. Install socks-proxy-agent package.',
            responseTime: null,
            location: null
          });
          return;
        }
      } else {
        try {
          const { HttpProxyAgent } = require('http-proxy-agent');
          agent = new HttpProxyAgent(proxyUrl);
        } catch (error) {
          // Fallback to manual proxy configuration
          options.hostname = proxy.host;
          options.port = parseInt(proxy.port);
          options.path = 'http://httpbin.org/ip';
          options.headers['Host'] = 'httpbin.org';
        }
      }
      
      if (agent) {
        options.agent = agent;
      }
      
      const req = http.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          const responseTime = Date.now() - startTime;
          
          try {
            const response = JSON.parse(data);
            const proxyIP = response.origin;
            
            // Basic validation - check if we got a different IP
            if (proxyIP && proxyIP !== proxy.host) {
              resolve({
                success: true,
                responseTime: responseTime,
                location: null, // We could add IP geolocation here
                error: null,
                proxyIP: proxyIP
              });
            } else {
              resolve({
                success: false,
                error: 'Proxy not working correctly - original IP detected',
                responseTime: responseTime,
                location: null
              });
            }
          } catch (parseError) {
            resolve({
              success: false,
              error: 'Invalid response from test server',
              responseTime: responseTime,
              location: null
            });
          }
        });
      });
      
      req.on('error', (error) => {
        const responseTime = Date.now() - startTime;
        let errorMessage = error.message;
        
        if (error.code === 'ECONNREFUSED') {
          errorMessage = 'Connection refused - proxy server not responding';
        } else if (error.code === 'ETIMEDOUT') {
          errorMessage = 'Connection timeout - proxy server too slow';
        } else if (error.code === 'ENOTFOUND') {
          errorMessage = 'Proxy server not found - check host address';
        } else if (error.code === 'ECONNRESET') {
          errorMessage = 'Connection reset - proxy server closed connection';
        }
        
        resolve({
          success: false,
          error: errorMessage,
          responseTime: responseTime > timeout ? null : responseTime,
          location: null
        });
      });
      
      req.on('timeout', () => {
        req.destroy();
        resolve({
          success: false,
          error: 'Connection timeout - proxy server not responding',
          responseTime: null,
          location: null
        });
      });
      
      req.setTimeout(timeout);
      req.end();
      
    } catch (error) {
      resolve({
        success: false,
        error: `Proxy test failed: ${error.message}`,
        responseTime: null,
        location: null
      });
    }
  });
}

let mainWindow;
let profileManager;
let proxyManager;
let browserLauncher;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'default',
    show: false
  });

  // Load the React app
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/build/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Initialize services
function initializeServices() {
  profileManager = new ProfileManager();
  proxyManager = new ProxyManager();
  browserLauncher = new BrowserLauncher({ debug: isDev });
}

// IPC Handlers
function setupIpcHandlers() {
  // Profile management
  ipcMain.handle('get-profiles', async () => {
    return await profileManager.getAllProfiles();
  });

  ipcMain.handle('create-profile', async (event, profileData) => {
    return await profileManager.createProfile(profileData);
  });

  ipcMain.handle('update-profile', async (event, profileId, profileData) => {
    return await profileManager.updateProfile(profileId, profileData);
  });

  ipcMain.handle('delete-profile', async (event, profileId) => {
    return await profileManager.deleteProfile(profileId);
  });

  // Proxy management
  ipcMain.handle('get-proxies', async () => {
    return await proxyManager.getAllProxies();
  });

  ipcMain.handle('create-proxy', async (event, proxyData) => {
    return await proxyManager.createProxy(proxyData);
  });

  ipcMain.handle('update-proxy', async (event, proxyId, proxyData) => {
    return await proxyManager.updateProxy(proxyId, proxyData);
  });

  ipcMain.handle('delete-proxy', async (event, proxyId) => {
    return await proxyManager.deleteProxy(proxyId);
  });

  ipcMain.handle('test-proxy', async (event, proxyId) => {
    try {
      const proxy = await proxyManager.getProxy(proxyId);
      if (!proxy) {
        throw new Error('Proxy not found');
      }

      // Update status to testing
      await proxyManager.updateProxyStatus(proxyId, 'testing');

      // Implement actual proxy testing
      const testResults = await testProxyConnection(proxy);
      const status = testResults.success ? 'working' : 'failed';
      
      return await proxyManager.updateProxyStatus(proxyId, status, testResults);
    } catch (error) {
      console.error('Error testing proxy:', error);
      await proxyManager.updateProxyStatus(proxyId, 'failed', { error: error.message });
      throw error;
    }
  });

  // Browser launching
  ipcMain.handle('launch-profile', async (event, profileId) => {
    try {
      console.log('Attempting to launch profile with ID:', profileId);
      const profile = await profileManager.getProfile(profileId);
      console.log('Retrieved profile:', profile);
      
      if (!profile) {
        throw new Error('Profile not found');
      }
      
      const result = await browserLauncher.launchBrowser(profile);
      console.log('Browser launch result:', result);
      return result;
    } catch (error) {
      console.error('Error in launch-profile handler:', error);
      return { 
        success: false, 
        error: error.message,
        details: error.stack 
      };
    }
  });

  ipcMain.handle('stop-profile', async (event, profileId) => {
    try {
      return await browserLauncher.stopBrowser(profileId);
    } catch (error) {
      console.error('Error in stop-profile handler:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  });

  // System info
  ipcMain.handle('get-app-version', () => {
    return app.getVersion();
  });

  // Open URL in active profile
  ipcMain.handle('open-url', async (event, url) => {
    try {
      const activeBrowsers = browserLauncher.getActiveBrowsers();
      if (activeBrowsers.length === 0) {
        throw new Error('No active browser profiles. Please launch a profile first.');
      }
      
      // Get the most recently launched browser
      const latestBrowser = activeBrowsers[activeBrowsers.length - 1];
      const browserInstance = browserLauncher.activeBrowsers.get(latestBrowser.profileId);
      
      if (browserInstance && browserInstance.browser) {
        const pages = await browserInstance.browser.pages();
        if (pages.length > 0) {
          // Use the first page or create a new one
          const page = pages[0];
          await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
          return { success: true, profileId: latestBrowser.profileId };
        } else {
          const newPage = await browserInstance.browser.newPage();
          await newPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
          return { success: true, profileId: latestBrowser.profileId };
        }
      }
      
      throw new Error('Browser instance not available');
    } catch (error) {
      console.error('Error opening URL:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  });
}

// App event handlers
app.whenReady().then(() => {
  initializeServices();
  setupIpcHandlers();
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', async () => {
  // Clean up running browser instances
  if (browserLauncher) {
    await browserLauncher.stopAllBrowsers();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, url) => {
    event.preventDefault();
  });
});
