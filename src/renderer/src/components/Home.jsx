import React from 'react';
import { Play, BarChart3, User } from 'lucide-react';

const Home = ({ profiles }) => {
  const runningProfiles = profiles.filter(p => p.status === 'running').length;
  const totalProfiles = profiles.length;

  const recentProfiles = profiles.slice(0, 5);

  return (
    <>
      <div className="px-8 py-6 border-b border-dark-700 bg-dark-800">
        <h2 className="text-2xl font-semibold mb-1">Dashboard</h2>
        <p className="text-dark-400 text-sm">Monitor your browser profiles and activity</p>
      </div>
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stat-card">
            <div className="stat-icon bg-primary-600">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-white">{totalProfiles}</div>
              <div className="text-sm text-dark-400">Total Profiles</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon bg-green-600">
              <Play className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-white">{runningProfiles}</div>
              <div className="text-sm text-dark-400">Active Sessions</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bg-yellow-600">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-white">0</div>
              <div className="text-sm text-dark-400">Proxy Issues</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-6">Recent Profiles</h3>
          {recentProfiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProfiles.map((profile) => (
                <div key={profile.id} className="profile-card">
                  <div className="flex justify-between items-center mb-4">
                    <div className="font-semibold text-white">{profile.name}</div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${profile.status === 'running' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                      <span className="text-xs text-dark-400">
                        {profile.status === 'running' ? 'Running' : 'Stopped'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="text-dark-400">
                      <span className="text-white font-medium">Tags:</span> {profile.tags?.join(', ') || 'None'}
                    </div>
                    <div className="text-dark-400">
                      <span className="text-white font-medium">Resolution:</span> {profile.resolution || '1920x1080'}
                    </div>
                    <div className="text-dark-400">
                      <span className="text-white font-medium">Proxy:</span> {profile.proxy ? 'Enabled' : 'None'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3 className="text-lg font-semibold text-white mb-3">No profiles yet</h3>
              <p className="mb-6">Create your first browser profile to get started</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
