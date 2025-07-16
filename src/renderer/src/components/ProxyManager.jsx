import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle, XCircle, Play } from 'lucide-react';

const ProxyManager = () => {
  const [proxies, setProxies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProxy, setEditingProxy] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    host: '',
    port: '',
    username: '',
    password: '',
    type: 'http'
  });

  useEffect(() => {
    loadProxies();
  }, []);

  const loadProxies = async () => {
    try {
      if (window.electronAPI) {
        const loadedProxies = await window.electronAPI.getProxies();
        setProxies(loadedProxies);
      }
    } catch (error) {
      console.error('Failed to load proxies:', error);
    }
  };

  const openModal = (proxy = null) => {
    if (proxy) {
      setEditingProxy(proxy);
      setFormData({
        name: proxy.name || '',
        host: proxy.host || '',
        port: proxy.port || '',
        username: proxy.username || '',
        password: proxy.password || '',
        type: proxy.type || 'http'
      });
    } else {
      setEditingProxy(null);
      setFormData({
        name: '',
        host: '',
        port: '',
        username: '',
        password: '',
        type: 'http'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProxy(null);
    setFormData({
      name: '',
      host: '',
      port: '',
      username: '',
      password: '',
      type: 'http'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (window.electronAPI) {
        if (editingProxy) {
          await window.electronAPI.updateProxy(editingProxy.id, formData);
        } else {
          await window.electronAPI.createProxy(formData);
        }
        await loadProxies();
        closeModal();
      }
    } catch (error) {
      console.error('Failed to save proxy:', error);
      alert('Failed to save proxy. Please try again.');
    }
  };

  const handleDelete = async (proxyId) => {
    if (window.confirm('Are you sure you want to delete this proxy?')) {
      try {
        if (window.electronAPI) {
          await window.electronAPI.deleteProxy(proxyId);
          await loadProxies();
        }
      } catch (error) {
        console.error('Failed to delete proxy:', error);
        alert('Failed to delete proxy. Please try again.');
      }
    }
  };

  const testProxy = async (proxyId) => {
    try {
      if (window.electronAPI) {
        await window.electronAPI.testProxy(proxyId);
        await loadProxies(); // Refresh to get updated status
      }
    } catch (error) {
      console.error('Failed to test proxy:', error);
      alert('Failed to test proxy. Please try again.');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'working':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'failed':
        return <XCircle size={16} className="text-red-500" />;
      case 'testing':
        return <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
    }
  };

  return (
    <>
      <div className="px-8 py-6 border-b border-dark-700 bg-dark-800">
        <h2 className="text-2xl font-semibold mb-1">Proxy Management</h2>
        <p className="text-dark-400 text-sm">Manage your proxy servers for anonymous browsing</p>
      </div>
      <div className="flex-1 p-8 overflow-y-auto">
        <button className="btn btn-primary mb-6" onClick={() => openModal()}>
          <Plus size={16} />
          Add New Proxy
        </button>

        {proxies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-dark-400 mb-4">No proxies configured yet.</p>
            <button className="btn btn-primary" onClick={() => openModal()}>
              Add Your First Proxy
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {proxies.map((proxy) => (
              <div key={proxy.id} className="profile-card">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(proxy.status)}
                      <h3 className="font-semibold">{proxy.name}</h3>
                      <span className="px-2 py-1 bg-dark-700 text-xs rounded">
                        {proxy.type?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-dark-400 font-mono">
                      {proxy.host}:{proxy.port}
                    </p>
                    {proxy.lastTested && (
                      <p className="text-xs text-dark-500 mt-1">
                        Last tested: {new Date(proxy.lastTested).toLocaleString()}
                      </p>
                    )}
                    {proxy.responseTime && (
                      <p className="text-xs text-green-400 mt-1">
                        Response time: {proxy.responseTime}ms
                      </p>
                    )}
                    {proxy.location && (
                      <p className="text-xs text-blue-400 mt-1">
                        Location: {proxy.location}
                      </p>
                    )}
                    {proxy.error && (
                      <p className="text-xs text-red-400 mt-1">
                        Error: {proxy.error}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => testProxy(proxy.id)}
                      disabled={proxy.status === 'testing'}
                      className="btn btn-sm btn-secondary"
                      title="Test Proxy"
                    >
                      <Play size={14} />
                    </button>
                    <button
                      onClick={() => openModal(proxy)}
                      className="btn btn-sm btn-secondary"
                      title="Edit Proxy"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(proxy.id)}
                      className="btn btn-sm btn-danger"
                      title="Delete Proxy"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {editingProxy ? 'Edit Proxy' : 'Add New Proxy'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-dark-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="form-group">
                  <label className="form-label">Proxy Name</label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="My Proxy Server"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Proxy Type</label>
                  <select
                    className="select"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="http">HTTP</option>
                    <option value="https">HTTPS</option>
                    <option value="socks4">SOCKS4</option>
                    <option value="socks5">SOCKS5</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Host/IP Address</label>
                    <input
                      type="text"
                      required
                      className="input"
                      value={formData.host}
                      onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                      placeholder="123.456.789.012"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Port</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="65535"
                      className="input"
                      value={formData.port}
                      onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                      placeholder="8080"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Username (optional)</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="username"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password (optional)</label>
                    <input
                      type="password"
                      className="input"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="password"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-dark-700">
                  <button type="button" onClick={closeModal} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingProxy ? 'Update Proxy' : 'Add Proxy'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProxyManager;
