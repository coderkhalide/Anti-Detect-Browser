const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class ProxyManager {
  constructor() {
    this.proxiesDir = path.join(process.cwd(), 'proxy_data');
    this.proxiesFile = path.join(this.proxiesDir, 'proxies.json');
    this.ensureProxiesDir();
  }

  async ensureProxiesDir() {
    try {
      await fs.access(this.proxiesDir);
    } catch (error) {
      await fs.mkdir(this.proxiesDir, { recursive: true });
    }
  }

  async getAllProxies() {
    try {
      const data = await fs.readFile(this.proxiesFile, 'utf8');
      const proxies = JSON.parse(data);
      return proxies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      // File doesn't exist or is empty, return empty array
      return [];
    }
  }

  async getProxy(proxyId) {
    try {
      const proxies = await this.getAllProxies();
      return proxies.find(proxy => proxy.id === proxyId) || null;
    } catch (error) {
      console.error('Error getting proxy:', error);
      return null;
    }
  }

  async saveProxies(proxies) {
    try {
      await this.ensureProxiesDir();
      await fs.writeFile(this.proxiesFile, JSON.stringify(proxies, null, 2));
    } catch (error) {
      console.error('Error saving proxies:', error);
      throw error;
    }
  }

  async createProxy(proxyData) {
    try {
      const proxyId = uuidv4();
      const proxy = {
        ...proxyData,
        id: proxyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'untested',
        lastTested: null
      };

      const proxies = await this.getAllProxies();
      proxies.push(proxy);
      await this.saveProxies(proxies);

      return proxy;
    } catch (error) {
      console.error('Error creating proxy:', error);
      throw error;
    }
  }

  async updateProxy(proxyId, proxyData) {
    try {
      const proxies = await this.getAllProxies();
      const proxyIndex = proxies.findIndex(proxy => proxy.id === proxyId);
      
      if (proxyIndex === -1) {
        throw new Error('Proxy not found');
      }

      const updatedProxy = {
        ...proxies[proxyIndex],
        ...proxyData,
        id: proxyId, // Ensure ID doesn't change
        updatedAt: new Date().toISOString()
      };

      proxies[proxyIndex] = updatedProxy;
      await this.saveProxies(proxies);

      return updatedProxy;
    } catch (error) {
      console.error('Error updating proxy:', error);
      throw error;
    }
  }

  async deleteProxy(proxyId) {
    try {
      const proxies = await this.getAllProxies();
      const filteredProxies = proxies.filter(proxy => proxy.id !== proxyId);
      
      if (filteredProxies.length === proxies.length) {
        throw new Error('Proxy not found');
      }

      await this.saveProxies(filteredProxies);
      return true;
    } catch (error) {
      console.error('Error deleting proxy:', error);
      throw error;
    }
  }

  async updateProxyStatus(proxyId, status, testResults = {}) {
    try {
      const proxy = await this.getProxy(proxyId);
      if (proxy) {
        const updatedProxy = {
          ...proxy,
          status,
          lastTested: new Date().toISOString(),
          ...testResults
        };
        await this.updateProxy(proxyId, updatedProxy);
        return updatedProxy;
      }
      return null;
    } catch (error) {
      console.error('Error updating proxy status:', error);
      throw error;
    }
  }

  // Helper method to format proxy for use in browser
  formatProxyForBrowser(proxy) {
    if (!proxy) return null;

    let proxyString = '';
    
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

    return proxyString;
  }
}

module.exports = ProxyManager;
