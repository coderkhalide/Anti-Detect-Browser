import React, { useState } from 'react';
import { Play, Trash2, Download, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

const ProxyTester = () => {
  const [proxies, setProxies] = useState([]);
  const [newProxy, setNewProxy] = useState('');
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Sample free proxies (these may not work - for demonstration only)
  const sampleProxies = [
    '45.76.43.71:1080',
    '104.248.90.212:80',
    '167.172.109.12:46437',
    '198.49.68.80:80',
    '103.216.207.15:8080',
    '8.210.83.33:80'
  ];

  const addProxy = () => {
    if (newProxy.trim() && !proxies.includes(newProxy.trim())) {
      setProxies([...proxies, newProxy.trim()]);
      setNewProxy('');
    }
  };

  const removeProxy = (proxyToRemove) => {
    setProxies(proxies.filter(proxy => proxy !== proxyToRemove));
    const newResults = { ...testResults };
    delete newResults[proxyToRemove];
    setTestResults(newResults);
  };

  const loadSampleProxies = () => {
    const newProxies = sampleProxies.filter(proxy => !proxies.includes(proxy));
    setProxies([...proxies, ...newProxies]);
  };

  const testProxy = async (proxy) => {
    setTestResults(prev => ({
      ...prev,
      [proxy]: { status: 'testing', startTime: Date.now() }
    }));

    try {
      // Simulate proxy testing (in real implementation, this would make actual HTTP requests)
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
      
      // Simulate random results for demo
      const isWorking = Math.random() > 0.6; // 40% success rate for free proxies
      const responseTime = Math.floor(Math.random() * 5000) + 500;
      const location = ['US', 'UK', 'DE', 'FR', 'CA', 'Unknown'][Math.floor(Math.random() * 6)];
      
      setTestResults(prev => ({
        ...prev,
        [proxy]: {
          status: isWorking ? 'working' : 'failed',
          responseTime: isWorking ? responseTime : null,
          location: isWorking ? location : null,
          lastTested: new Date().toLocaleTimeString(),
          error: isWorking ? null : 'Connection failed or timeout'
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [proxy]: {
          status: 'failed',
          lastTested: new Date().toLocaleTimeString(),
          error: error.message
        }
      }));
    }
  };

  const testAllProxies = async () => {
    setIsLoading(true);
    for (const proxy of proxies) {
      await testProxy(proxy);
      // Small delay between tests to avoid overwhelming
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    setIsLoading(false);
  };

  const getStatusIcon = (proxy) => {
    const result = testResults[proxy];
    if (!result) return <Clock className="w-4 h-4 text-gray-500" />;
    
    switch (result.status) {
      case 'working':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'testing':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const exportWorkingProxies = () => {
    const workingProxies = proxies.filter(proxy => 
      testResults[proxy]?.status === 'working'
    );
    
    if (workingProxies.length === 0) {
      alert('No working proxies to export. Test proxies first.');
      return;
    }

    const proxyData = workingProxies.map(proxy => ({
      proxy,
      responseTime: testResults[proxy].responseTime,
      location: testResults[proxy].location,
      lastTested: testResults[proxy].lastTested
    }));

    const dataStr = JSON.stringify(proxyData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'working-proxies.json';
    link.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="px-8 py-6 border-b border-dark-700 bg-dark-800">
        <h2 className="text-2xl font-semibold mb-1">Free Proxy Tester</h2>
        <p className="text-dark-400 text-sm">Test free proxies before using them in your profiles</p>
      </div>
      
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl">
          
          {/* Warning Banner */}
          <div className="bg-yellow-900/20 border border-yellow-600/30 text-yellow-300 p-4 mb-6 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <strong>Warning:</strong>
            </div>
            <p className="mt-2 text-sm">
              Free proxies can be unreliable and unsafe. They may log your traffic, inject malware, or compromise your privacy. 
              Use only for testing purposes and never for sensitive activities.
            </p>
          </div>

          {/* Add Proxy Section */}
          <div className="profile-card mb-6">
            <h3 className="text-lg font-semibold mb-4">Add Proxies to Test</h3>
            
            <div className="mb-4">
              <div className="flex gap-3 mb-3">
                <input
                  type="text"
                  value={newProxy}
                  onChange={(e) => setNewProxy(e.target.value)}
                  placeholder="Enter proxy (ip:port)"
                  className="input flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && addProxy()}
                />
                <button
                  onClick={addProxy}
                  className="btn btn-primary"
                >
                  Add Proxy
                </button>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={loadSampleProxies}
                  className="btn btn-secondary"
                >
                  Load Sample Proxies
                </button>
                <button
                  onClick={testAllProxies}
                  disabled={isLoading || proxies.length === 0}
                  className="btn btn-success disabled:opacity-50"
                >
                  {isLoading ? 'Testing...' : 'Test All Proxies'}
                </button>
                <button
                  onClick={exportWorkingProxies}
                  className="btn btn-info"
                >
                  <Download className="w-4 h-4 inline mr-1" />
                  Export Working
                </button>
              </div>
            </div>
          </div>

          {/* Proxy List */}
          <div className="profile-card">
            <h3 className="text-lg font-semibold mb-4">Proxy Test Results</h3>
            
            {proxies.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-dark-400 mb-4">No proxies added yet. Add some proxies to test them.</p>
                <button 
                  onClick={loadSampleProxies}
                  className="btn btn-primary"
                >
                  Load Sample Proxies
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {proxies.map((proxy, index) => {
                  const result = testResults[proxy];
                  return (
                    <div key={index} className="flex items-center justify-between p-4 border border-dark-700 rounded-lg bg-dark-800/50">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(proxy)}
                        <span className="font-mono text-sm text-white">{proxy}</span>
                        {result?.location && (
                          <span className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded border border-blue-600/30">
                            {result.location}
                          </span>
                        )}
                        {result?.responseTime && (
                          <span className="text-xs text-green-400">
                            {result.responseTime}ms
                          </span>
                        )}
                        {result?.error && (
                          <span className="text-xs text-red-400 max-w-xs truncate">
                            {result.error}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {result?.lastTested && (
                          <span className="text-xs text-dark-400">
                            {result.lastTested}
                          </span>
                        )}
                        <button
                          onClick={() => testProxy(proxy)}
                          disabled={result?.status === 'testing'}
                          className="btn btn-sm btn-secondary disabled:opacity-50"
                          title="Test Proxy"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeProxy(proxy)}
                          className="btn btn-sm btn-danger"
                          title="Remove Proxy"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Information Section */}
          <div className="profile-card mt-6">
            <h3 className="text-lg font-semibold mb-4">Proxy Format Examples</h3>
            <div className="space-y-2 text-sm font-mono bg-dark-800/50 p-4 rounded-lg border border-dark-700">
              <div className="text-dark-300">HTTP: <span className="text-blue-400">123.456.789.012:8080</span></div>
              <div className="text-dark-300">HTTP with auth: <span className="text-blue-400">http://user:pass@123.456.789.012:8080</span></div>
              <div className="text-dark-300">SOCKS5: <span className="text-blue-400">socks5://123.456.789.012:1080</span></div>
              <div className="text-dark-300">SOCKS5 with auth: <span className="text-blue-400">socks5://user:pass@123.456.789.012:1080</span></div>
            </div>
            
            <h3 className="text-lg font-semibold mb-3 mt-6">Free Proxy Sources</h3>
            <ul className="space-y-2 text-sm text-dark-300">
              <li>• <strong className="text-white">FreeProxyList.net</strong> - Updated daily proxy lists</li>
              <li>• <strong className="text-white">ProxyScrape.com</strong> - API access to proxy lists</li>
              <li>• <strong className="text-white">GeoNode.com</strong> - Geographic proxy filtering</li>
              <li>• <strong className="text-white">SpyProxy.net</strong> - Anonymous proxy lists</li>
            </ul>
            
            <div className="mt-6 p-4 bg-red-900/20 border border-red-600/30 text-red-300 rounded-lg">
              <strong>Remember:</strong> Always verify proxy reliability and security before use. 
              Consider paid proxy services for production use.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProxyTester;
