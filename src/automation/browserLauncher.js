const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const path = require('path');
const os = require('os');
const fs = require('fs').promises;

// Add stealth plugin to avoid detection
puppeteer.use(StealthPlugin());

class BrowserLauncher {
  constructor(options = {}) {
    this.activeBrowsers = new Map(); // profileId -> browser instance
    this.browserDataDir = path.join(os.tmpdir(), 'antidetect-browser-profiles');
    this.debug = options.debug || false;
    this.ensureBrowserDataDir();
    
    // Setup cleanup handlers
    this.setupCleanupHandlers();
  }

  setupCleanupHandlers() {
    // Cleanup on process exit
    const cleanup = async () => {
      console.log('Cleaning up browser processes...');
      await this.stopAllBrowsers();
    };

    process.on('exit', cleanup);
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.on('uncaughtException', (error) => {
      console.error('Uncaught exception:', error);
      cleanup().then(() => process.exit(1));
    });
  }

  async ensureBrowserDataDir() {
    try {
      await fs.access(this.browserDataDir);
    } catch (error) {
      await fs.mkdir(this.browserDataDir, { recursive: true });
    }
  }

  async launchBrowser(profile) {
    try {
      // Validate profile data
      if (!profile || !profile.id) {
        throw new Error('Invalid profile: missing profile ID');
      }

      // Stop existing browser instance if running
      if (this.activeBrowsers.has(profile.id)) {
        await this.stopBrowser(profile.id);
      }

      console.log(`Launching browser for profile: ${profile.name} (ID: ${profile.id})`);

      // Ensure browser data directory exists
      await this.ensureBrowserDataDir();

      // Create user data directory for this profile
      const userDataDir = path.join(this.browserDataDir, profile.id);
      
      // Ensure the profile-specific directory exists
      try {
        await fs.access(userDataDir);
      } catch (error) {
        await fs.mkdir(userDataDir, { recursive: true });
      }

      // Set proper permissions on macOS
      if (process.platform === 'darwin') {
        try {
          await fs.chmod(userDataDir, 0o755);
        } catch (error) {
          console.warn('Failed to set directory permissions:', error.message);
        }
      }

      // Parse resolution
      const [width, height] = (profile.resolution || '1920x1080').split('x').map(Number);

      // Configure launch options with improved stability
      const debugPort = 9222 + Math.floor(Math.random() * 1000); // Random port to avoid conflicts
      const launchOptions = {
        headless: false,
        userDataDir,
        defaultViewport: { width, height },
        timeout: 60000, // Increase timeout to 60 seconds
        executablePath: this.getChromePath(), // Use system Chrome if available
        args: [
          `--window-size=${width},${height}`,
          `--remote-debugging-port=${debugPort}`,
          '--no-first-run',
          '--no-default-browser-check',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--disable-features=TranslateUI',
          '--disable-ipc-flooding-protection',
          '--disable-background-media-suspension',
          '--force-color-profile=srgb',
          '--metrics-recording-only',
          '--disable-default-apps',
          '--disable-dev-shm-usage', // Overcome limited resource problems
          '--disable-extensions',
          '--disable-gpu-sandbox',
          '--disable-software-rasterizer',
          '--disable-background-networking',
          '--disable-background-timer-throttling',
          '--disable-client-side-phishing-detection',
          '--disable-default-apps',
          '--disable-hang-monitor',
          '--disable-popup-blocking',
          '--disable-prompt-on-repost',
          '--disable-sync',
          '--disable-translate',
          '--disable-web-security',
          '--metrics-recording-only',
          '--no-first-run',
          '--safebrowsing-disable-auto-update',
          '--enable-automation',
          '--password-store=basic',
          '--use-mock-keychain',
          '--disable-blink-features=AutomationControlled',
          '--disable-component-extensions-with-background-pages',
          '--disable-permissions-api',
          '--disable-notifications'
        ]
      };

      // Add proxy configuration if provided
      if (profile.proxy) {
        // Handle both string format (legacy) and object format (new)
        let proxyString = profile.proxy;
        if (typeof profile.proxy === 'object') {
          // Format proxy object to string
          const proxy = profile.proxy;
          proxyString = '';
          
          if (proxy.type === 'socks5') {
            proxyString = 'socks5://';
          } else if (proxy.type === 'socks4') {
            proxyString = 'socks4://';
          } else {
            proxyString = 'http://';
          }

          if (proxy.username && proxy.password) {
            proxyString += `${proxy.username}:${proxy.password}@`;
          }

          proxyString += `${proxy.host}:${proxy.port}`;
        }
        
        console.log(`Using proxy: ${proxyString.replace(/:([^:@]+)@/, ':***@')}`); // Hide password in logs
        launchOptions.args.push(`--proxy-server=${proxyString}`);
        
        // Add proxy-related Chrome flags for better compatibility
        launchOptions.args.push('--proxy-bypass-list=<-loopback>');
        launchOptions.args.push('--disable-proxy-certificate-handler');
      }

      // Set custom user agent if provided
      if (profile.userAgent) {
        launchOptions.args.push(`--user-agent=${profile.userAgent}`);
      }

      // Launch browser with retry logic
      let browser;
      let lastError;
      const maxRetries = 3;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`Browser launch attempt ${attempt}/${maxRetries}`);
          if (this.debug) {
            console.log('Launch options:', JSON.stringify(launchOptions, null, 2));
          }
          browser = await puppeteer.launch(launchOptions);
          console.log('Browser launched successfully');
          break; // Success, exit retry loop
        } catch (error) {
          lastError = error;
          console.error(`Browser launch attempt ${attempt} failed:`, error.message);
          if (this.debug) {
            console.error('Full error:', error);
          }
          
          if (attempt < maxRetries) {
            console.log(`Retrying in 2 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Clean up any partial browser processes
            try {
              if (browser) {
                await browser.close().catch(() => {});
              }
            } catch (cleanupError) {
              // Ignore cleanup errors
            }
          }
        }
      }
      
      if (!browser) {
        throw new Error(`Failed to launch browser after ${maxRetries} attempts. Last error: ${lastError.message}`);
      }

      // Store browser instance
      this.activeBrowsers.set(profile.id, {
        browser,
        profile,
        launchedAt: new Date()
      });

      // Get the first page with timeout protection
      let page;
      try {
        const pages = await Promise.race([
          browser.pages(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout getting pages')), 10000))
        ]);
        page = pages[0];
        
        if (!page) {
          page = await Promise.race([
            browser.newPage(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout creating new page')), 10000))
          ]);
        }
      } catch (error) {
        console.error('Error getting/creating page:', error);
        await browser.close().catch(() => {});
        this.activeBrowsers.delete(profile.id);
        throw new Error(`Failed to get browser page: ${error.message}`);
      }

      // Set viewport with retry
      try {
        await page.setViewport({ width, height });
      } catch (error) {
        console.warn('Failed to set viewport:', error.message);
      }

      // Set user agent if provided
      if (profile.userAgent) {
        try {
          await page.setUserAgent(profile.userAgent);
        } catch (error) {
          console.warn('Failed to set user agent:', error.message);
        }
      }

      // Add fingerprint spoofing
      try {
        await this.applyFingerprintSpoofing(page, profile);
      } catch (error) {
        console.warn('Failed to apply fingerprint spoofing:', error.message);
      }

      // Open predefined tabs
      if (profile.tabs && profile.tabs.length > 0) {
        // Navigate first tab
        if (profile.tabs[0]) {
          try {
            await Promise.race([
              page.goto(profile.tabs[0], { waitUntil: 'domcontentloaded', timeout: 20000 }),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Navigation timeout')), 25000))
            ]);
          } catch (error) {
            console.error('Error loading first tab:', error);
            try {
              await page.goto('https://www.google.com', { waitUntil: 'domcontentloaded', timeout: 15000 });
            } catch (fallbackError) {
              console.warn('Fallback navigation also failed:', fallbackError.message);
            }
          }
        }

        // Open additional tabs (limit to 3 for stability)
        for (let i = 1; i < Math.min(profile.tabs.length, 3); i++) {
          try {
            const newPage = await browser.newPage();
            await newPage.setViewport({ width, height });
            if (profile.userAgent) {
              await newPage.setUserAgent(profile.userAgent);
            }
            await this.applyFingerprintSpoofing(newPage, profile);
            await newPage.goto(profile.tabs[i], { waitUntil: 'domcontentloaded', timeout: 15000 });
          } catch (error) {
            console.error(`Error loading tab ${i + 1}:`, error);
          }
        }
      } else {
        // Navigate to Google if no tabs specified
        try {
          console.log('Navigating to Google...');
          await page.goto('https://www.google.com', { waitUntil: 'domcontentloaded', timeout: 15000 });
          console.log('Successfully navigated to Google');
        } catch (error) {
          console.error('Failed to navigate to Google:', error.message);
          
          // Check if this is a proxy-related error
          if (error.message.includes('ERR_TUNNEL_CONNECTION_FAILED')) {
            console.error('PROXY ERROR: Tunnel connection failed. This usually means:');
            console.error('1. Proxy server is not responding');
            console.error('2. Wrong proxy port (try 8080, 3128, or 1080 instead of 80)');
            console.error('3. Proxy requires authentication but none provided');
            console.error('4. Proxy type mismatch (HTTP vs SOCKS)');
            
            if (profile.proxy) {
              console.error('Current proxy config:', {
                host: profile.proxy.host,
                port: profile.proxy.port,
                type: profile.proxy.type,
                hasAuth: !!(profile.proxy.username && profile.proxy.password)
              });
            }
          } else if (error.message.includes('ERR_PROXY_CONNECTION_FAILED')) {
            console.error('PROXY ERROR: Proxy connection failed. Check proxy server status.');
          } else if (error.message.includes('ERR_PROXY_AUTH_REQUESTED')) {
            console.error('PROXY ERROR: Proxy authentication required. Add username and password.');
          }
          
          // Try to load a simple page to test basic connectivity
          try {
            console.log('Trying to load simple test page...');
            await page.goto('data:text/html,<h1>Browser Ready</h1><p>Proxy: ' + (profile.proxy ? 'Enabled' : 'Disabled') + '</p>', { timeout: 5000 });
          } catch (fallbackError) {
            console.warn('Even basic page loading failed:', fallbackError.message);
          }
        }
      }

      // Handle browser closure
      browser.on('disconnected', () => {
        this.activeBrowsers.delete(profile.id);
      });

      console.log(`Browser launched successfully for profile: ${profile.name}`);
      return { success: true, profileId: profile.id };

    } catch (error) {
      console.error('Error launching browser:', error);
      throw new Error(`Failed to launch browser: ${error.message}`);
    }
  }

  getChromePath() {
    // Try to find Chrome/Chromium executable on the system
    const possiblePaths = [];
    
    if (process.platform === 'darwin') {
      possiblePaths.push(
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Chromium.app/Contents/MacOS/Chromium',
        '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary'
      );
    } else if (process.platform === 'win32') {
      possiblePaths.push(
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Users\\' + os.userInfo().username + '\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'
      );
    } else {
      possiblePaths.push(
        '/usr/bin/google-chrome',
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium',
        '/snap/bin/chromium'
      );
    }

    // Check which Chrome executable exists
    for (const chromePath of possiblePaths) {
      try {
        require('fs').accessSync(chromePath);
        console.log(`Using Chrome at: ${chromePath}`);
        return chromePath;
      } catch (error) {
        // Continue to next path
      }
    }

    // Return undefined to use bundled Chromium
    console.log('No system Chrome found, using bundled Chromium');
    return undefined;
  }

  async applyFingerprintSpoofing(page, profile) {
    try {
      // Override WebGL fingerprinting
      await page.evaluateOnNewDocument(() => {
        const getParameter = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function(parameter) {
          // Spoof specific WebGL parameters
          if (parameter === 37445) {
            return 'Intel Inc.'; // UNMASKED_VENDOR_WEBGL
          }
          if (parameter === 37446) {
            return 'Intel(R) Iris(TM) Graphics 6100'; // UNMASKED_RENDERER_WEBGL
          }
          return getParameter.call(this, parameter);
        };
      });

      // Override canvas fingerprinting
      await page.evaluateOnNewDocument(() => {
        const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
        HTMLCanvasElement.prototype.toDataURL = function(type) {
          // Add slight noise to canvas
          const ctx = this.getContext('2d');
          if (ctx) {
            const imageData = ctx.getImageData(0, 0, this.width, this.height);
            for (let i = 0; i < imageData.data.length; i += 4) {
              imageData.data[i] += Math.floor(Math.random() * 3) - 1; // Red
              imageData.data[i + 1] += Math.floor(Math.random() * 3) - 1; // Green
              imageData.data[i + 2] += Math.floor(Math.random() * 3) - 1; // Blue
            }
            ctx.putImageData(imageData, 0, 0);
          }
          return originalToDataURL.call(this, type);
        };
      });

      // Override timezone
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(Intl.DateTimeFormat.prototype, 'resolvedOptions', {
          value: function() {
            return {
              locale: 'en-US',
              calendar: 'gregory',
              numberingSystem: 'latn',
              timeZone: 'America/New_York'
            };
          }
        });
      });

      // Override language and platform
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'language', {
          get: function() { return 'en-US'; }
        });
        Object.defineProperty(navigator, 'languages', {
          get: function() { return ['en-US', 'en']; }
        });
        Object.defineProperty(navigator, 'platform', {
          get: function() { return 'Win32'; }
        });
      });

      // Remove webdriver property
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {
          get: () => undefined
        });
      });

    } catch (error) {
      console.error('Error applying fingerprint spoofing:', error);
    }
  }

  async stopBrowser(profileId) {
    try {
      const browserInstance = this.activeBrowsers.get(profileId);
      if (browserInstance) {
        console.log(`Stopping browser for profile: ${browserInstance.profile.name}`);
        
        // Close browser with timeout protection
        await Promise.race([
          browserInstance.browser.close(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Browser close timeout')), 10000)
          )
        ]);
        
        this.activeBrowsers.delete(profileId);
        console.log(`Browser stopped for profile: ${browserInstance.profile.name}`);
        return { success: true };
      }
      return { success: false, message: 'Browser not found' };
    } catch (error) {
      console.error('Error stopping browser:', error);
      // Force delete from active browsers even if close failed
      this.activeBrowsers.delete(profileId);
      throw new Error(`Failed to stop browser: ${error.message}`);
    }
  }

  async stopAllBrowsers() {
    try {
      const stopPromises = Array.from(this.activeBrowsers.keys()).map(profileId => 
        this.stopBrowser(profileId)
      );
      await Promise.all(stopPromises);
      console.log('All browsers stopped');
    } catch (error) {
      console.error('Error stopping all browsers:', error);
    }
  }

  getActiveBrowsers() {
    return Array.from(this.activeBrowsers.values()).map(instance => ({
      profileId: instance.profile.id,
      profileName: instance.profile.name,
      launchedAt: instance.launchedAt
    }));
  }
}

module.exports = BrowserLauncher;
