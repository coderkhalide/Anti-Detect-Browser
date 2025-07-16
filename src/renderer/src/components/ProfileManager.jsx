import React, { useState, useEffect } from 'react';
import { Plus, Play, Edit, Trash2, Copy } from 'lucide-react';

const ProfileManager = ({ profiles, onProfilesChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [availableProxies, setAvailableProxies] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    userAgent: '',
    proxyId: '', // Changed from proxy to proxyId
    resolution: '1920x1080',
    tags: '',
    cookies: '',
    tabs: ''
  });

  useEffect(() => {
    loadProxies();
  }, []);

  const loadProxies = async () => {
    try {
      if (window.electronAPI) {
        const proxies = await window.electronAPI.getProxies();
        setAvailableProxies(proxies.filter(proxy => proxy.status === 'working'));
      }
    } catch (error) {
      console.error('Failed to load proxies:', error);
    }
  };

  const resolutionOptions = [
    '1920x1080',
    '1366x768',
    '1440x900',
    '1280x720',
    '1536x864',
    '1600x900'
  ];

  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0'
  ];

  const openModal = (profile = null) => {
    loadProxies(); // Refresh proxy list when opening modal
    if (profile) {
      setEditingProfile(profile);
      
      // Handle both old string proxies and new proxy objects
      let selectedProxyId = '';
      if (profile.proxy) {
        if (typeof profile.proxy === 'object' && profile.proxy.id) {
          selectedProxyId = profile.proxy.id;
        } else if (typeof profile.proxy === 'string' && profile.proxyId) {
          selectedProxyId = profile.proxyId;
        }
      }
      
      setFormData({
        name: profile.name,
        userAgent: profile.userAgent || '',
        proxyId: selectedProxyId,
        resolution: profile.resolution || '1920x1080',
        tags: profile.tags ? profile.tags.join(', ') : '',
        cookies: profile.cookies || '',
        tabs: profile.tabs ? profile.tabs.join('\n') : ''
      });
    } else {
      setEditingProfile(null);
      setFormData({
        name: '',
        userAgent: userAgents[0],
        proxyId: '',
        resolution: '1920x1080',
        tags: '',
        cookies: '',
        tabs: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProfile(null);
    setFormData({
      name: '',
      userAgent: '',
      proxyId: '',
      resolution: '1920x1080',
      tags: '',
      cookies: '',
      tabs: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Find the selected proxy and get its details
    let proxyData = null;
    if (formData.proxyId) {
      const selectedProxy = availableProxies.find(proxy => proxy.id === formData.proxyId);
      if (selectedProxy) {
        proxyData = selectedProxy;
      }
    }
    
    const profileData = {
      ...formData,
      proxy: proxyData, // Store the full proxy object
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
      tabs: formData.tabs ? formData.tabs.split('\n').filter(tab => tab.trim()) : [],
      id: editingProfile ? editingProfile.id : undefined
    };

    try {
      if (window.electronAPI) {
        if (editingProfile) {
          await window.electronAPI.updateProfile(editingProfile.id, profileData);
        } else {
          await window.electronAPI.createProfile(profileData);
        }
        onProfilesChange();
        closeModal();
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const handleLaunch = async (profileId) => {
    try {
      if (window.electronAPI) {
        await window.electronAPI.launchProfile(profileId);
        onProfilesChange();
      }
    } catch (error) {
      console.error('Failed to launch profile:', error);
    }
  };

  const handleDelete = async (profileId) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      try {
        if (window.electronAPI) {
          await window.electronAPI.deleteProfile(profileId);
          onProfilesChange();
        }
      } catch (error) {
        console.error('Failed to delete profile:', error);
      }
    }
  };

  const handleDuplicate = async (profile) => {
    const duplicatedProfile = {
      ...profile,
      name: `${profile.name} (Copy)`,
      id: undefined
    };
    
    try {
      if (window.electronAPI) {
        await window.electronAPI.createProfile(duplicatedProfile);
        onProfilesChange();
      }
    } catch (error) {
      console.error('Failed to duplicate profile:', error);
    }
  };

  return (
    <>
      <div className="px-8 py-6 border-b border-dark-700 bg-dark-800">
        <h2 className="text-2xl font-semibold mb-1">Browser Profiles</h2>
        <p className="text-dark-400 text-sm">Manage your anti-detect browser profiles</p>
      </div>
      <div className="flex-1 p-8 overflow-y-auto">
        <button className="btn btn-primary mb-6" onClick={() => openModal()}>
          <Plus size={16} />
          Create New Profile
        </button>

        {profiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <div key={profile.id} className="profile-card">
                <div className="flex justify-between items-center mb-4">
                  <div className="font-semibold text-white">{profile.name}</div>
                  <div className="flex gap-2">
                    <button 
                      className="btn-icon" 
                      onClick={() => handleLaunch(profile.id)}
                      title="Launch Profile"
                    >
                      <Play size={16} />
                    </button>
                    <button 
                      className="btn-icon" 
                      onClick={() => openModal(profile)}
                      title="Edit Profile"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="btn-icon" 
                      onClick={() => handleDuplicate(profile)}
                      title="Duplicate Profile"
                    >
                      <Copy size={16} />
                    </button>
                    <button 
                      className="btn-icon" 
                      onClick={() => handleDelete(profile.id)}
                      title="Delete Profile"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-sm mb-4">
                  <div className="text-dark-400">
                    <span className="text-white font-medium">Tags:</span> {profile.tags?.join(', ') || 'None'}
                  </div>
                  <div className="text-dark-400">
                    <span className="text-white font-medium">Resolution:</span> {profile.resolution || '1920x1080'}
                  </div>
                  <div className="text-dark-400">
                    <span className="text-white font-medium">Proxy:</span> {
                      profile.proxy ? 
                        (typeof profile.proxy === 'object' ? 
                          `${profile.proxy.name} (${profile.proxy.host}:${profile.proxy.port})` : 
                          profile.proxy
                        ) : 
                        'None'
                    }
                  </div>
                  <div className="text-dark-400">
                    <span className="text-white font-medium">User Agent:</span> {profile.userAgent ? `${profile.userAgent.substring(0, 50)}...` : 'Default'}
                  </div>
                </div>
                <button 
                  className="btn btn-primary w-full" 
                  onClick={() => handleLaunch(profile.id)}
                >
                  <Play size={16} />
                  Launch Browser
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3 className="text-lg font-semibold text-white mb-3">No profiles created yet</h3>
            <p className="mb-6">Create your first browser profile to start browsing anonymously</p>
            <button className="btn btn-primary" onClick={() => openModal()}>
              <Plus size={16} />
              Create First Profile
            </button>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">{editingProfile ? 'Edit Profile' : 'Create New Profile'}</h3>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Profile Name</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    placeholder="e.g., Facebook Profile, Work Account"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">User Agent</label>
                  <select
                    className="select"
                    value={formData.userAgent}
                    onChange={(e) => setFormData({...formData, userAgent: e.target.value})}
                  >
                    {userAgents.map((ua, index) => (
                      <option key={index} value={ua}>
                        {/* {ua.includes('Windows') ? 'Windows Chrome' : 
                         ua.includes('Macintosh') ? 'macOS Chrome' :
                         ua.includes('Linux') ? 'Linux Chrome' :
                         ua.includes('Firefox') ? 'Firefox' : 'Chrome'} */}
                         {ua}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Screen Resolution</label>
                  <select
                    className="select"
                    value={formData.resolution}
                    onChange={(e) => setFormData({...formData, resolution: e.target.value})}
                  >
                    {resolutionOptions.map((res) => (
                      <option key={res} value={res}>{res}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Proxy (optional)</label>
                  <select
                    className="select"
                    value={formData.proxyId}
                    onChange={(e) => setFormData({...formData, proxyId: e.target.value})}
                  >
                    <option value="">No Proxy</option>
                    {availableProxies.map((proxy) => (
                      <option key={proxy.id} value={proxy.id}>
                        {proxy.name} - {proxy.host}:{proxy.port} ({proxy.type?.toUpperCase()})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-dark-400 mt-1">
                    Only working proxies are shown. Manage proxies in the Proxy section.
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label">Tags (comma-separated)</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="e.g., social media, work, personal"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">URLs to open (one per line)</label>
                  <textarea
                    className="textarea"
                    value={formData.tabs}
                    onChange={(e) => setFormData({...formData, tabs: e.target.value})}
                    placeholder="https://facebook.com&#10;https://twitter.com&#10;https://instagram.com"
                  />
                </div>

                <div className="flex gap-3 justify-end mt-8">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingProfile ? 'Update Profile' : 'Create Profile'}
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

export default ProfileManager;
