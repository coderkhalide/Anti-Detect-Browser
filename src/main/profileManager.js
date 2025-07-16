const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto-js');

class ProfileManager {
  constructor() {
    this.profilesDir = path.join(process.cwd(), 'profile_data');
    this.ensureProfilesDir();
  }

  async ensureProfilesDir() {
    try {
      await fs.access(this.profilesDir);
    } catch (error) {
      await fs.mkdir(this.profilesDir, { recursive: true });
    }
  }

  async getAllProfiles() {
    try {
      const files = await fs.readdir(this.profilesDir);
      const profiles = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          try {
            const profilePath = path.join(this.profilesDir, file);
            const data = await fs.readFile(profilePath, 'utf8');
            const profile = JSON.parse(data);
            profiles.push(profile);
          } catch (error) {
            console.error(`Error loading profile ${file}:`, error);
          }
        }
      }

      return profiles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error('Error getting profiles:', error);
      return [];
    }
  }

  async getProfile(profileId) {
    try {
      const profilePath = path.join(this.profilesDir, `${profileId}.json`);
      const data = await fs.readFile(profilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  }

  async createProfile(profileData) {
    try {
      const profileId = uuidv4();
      console.log('Generated profile ID:', profileId);
      
      const profile = {
          ...profileData,
          id: profileId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'stopped'
      };

      console.log('Creating profile:', profile);

      const profilePath = path.join(this.profilesDir, `${profile.id}.json`);
      await fs.writeFile(profilePath, JSON.stringify(profile, null, 2));

      return profile;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  async updateProfile(profileId, profileData) {
    try {
      const existingProfile = await this.getProfile(profileId);
      if (!existingProfile) {
        throw new Error('Profile not found');
      }

      const updatedProfile = {
        ...existingProfile,
        ...profileData,
        id: profileId, // Ensure ID doesn't change
        updatedAt: new Date().toISOString()
      };

      const profilePath = path.join(this.profilesDir, `${profileId}.json`);
      await fs.writeFile(profilePath, JSON.stringify(updatedProfile, null, 2));

      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async deleteProfile(profileId) {
    try {
      const profilePath = path.join(this.profilesDir, `${profileId}.json`);
      await fs.unlink(profilePath);
      return true;
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  }

  async updateProfileStatus(profileId, status) {
    try {
      const profile = await this.getProfile(profileId);
      if (profile) {
        profile.status = status;
        await this.updateProfile(profileId, profile);
      }
    } catch (error) {
      console.error('Error updating profile status:', error);
    }
  }

  // Utility methods for encryption (for future use)
  encryptData(data, key) {
    return crypto.AES.encrypt(JSON.stringify(data), key).toString();
  }

  decryptData(encryptedData, key) {
    const bytes = crypto.AES.decrypt(encryptedData, key);
    return JSON.parse(bytes.toString(crypto.enc.Utf8));
  }
}

module.exports = ProfileManager;
