# Proxy Integration Guide

## How to Use Saved Proxies with Profiles

Your anti-detect browser now supports creating and managing proxies separately, then assigning them to profiles. This makes proxy management much more organized and reusable.

## Step-by-Step Setup

### 1. Create and Test Proxies

1. **Go to Proxy Manager**:
   - Click "Proxies" in the sidebar
   - Click "Add New Proxy"

2. **Add Proxy Details**:
   ```
   Name: My VPN Proxy
   Type: HTTP (or SOCKS5)
   Host: 123.456.789.012
   Port: 8080
   Username: myusername (optional)
   Password: mypassword (optional)
   ```

3. **Test the Proxy**:
   - Click the "Play" button next to your proxy
   - Wait for the test to complete
   - Only "working" proxies will be available for profiles

### 2. Create Profile with Proxy

1. **Go to Profile Manager**:
   - Click "Profiles" in the sidebar
   - Click "Create New Profile"

2. **Select Your Proxy**:
   - In the "Proxy" dropdown, you'll see all working proxies
   - Select the proxy you want to use
   - Or choose "No Proxy" for direct connection

3. **Complete Profile Setup**:
   - Add profile name, user agent, resolution, etc.
   - Save the profile

### 3. Launch Profile with Proxy

1. **Launch the Profile**:
   - Click the "Launch Browser" button
   - Browser opens with your selected proxy automatically configured

2. **Verify Proxy is Working**:
   - Use the built-in "Fingerprint Tester" or visit whatismyip.com
   - Your IP should show the proxy server's IP, not your real IP

## Benefits of This System

### ✅ **Organized Management**
- All proxies stored in one place
- Reuse proxies across multiple profiles
- Easy to test and manage proxy status

### ✅ **Automatic Integration**
- No need to manually enter proxy strings
- Proxy automatically configured when launching profile
- Supports HTTP, HTTPS, SOCKS4, and SOCKS5

### ✅ **Status Tracking**
- See which proxies are working
- Last tested time and response time
- Error details for failed proxies

### ✅ **Profile Display**
- Profiles show proxy name instead of raw connection string
- Easy to see which proxy each profile uses
- Clean, organized interface

## Proxy Types Supported

### HTTP/HTTPS Proxies
```
Type: http or https
Format: http://host:port
With Auth: http://username:password@host:port
```

### SOCKS Proxies
```
Type: socks4 or socks5
Format: socks5://host:port
With Auth: socks5://username:password@host:port
```

## Migration from Old System

If you have existing profiles with manually entered proxy strings:

1. **Create New Proxy Entries**:
   - Add your proxy details to the Proxy Manager
   - Test to ensure they're working

2. **Update Existing Profiles**:
   - Edit each profile
   - Select the appropriate proxy from the dropdown
   - Save the profile

3. **Old Proxy Strings**:
   - Old proxy strings will still work but won't show proxy names
   - Recommended to migrate to the new system for better management

## Troubleshooting

### Proxy Not Showing in Dropdown
- Make sure the proxy status is "working"
- Test the proxy in Proxy Manager
- Refresh the profile creation form

### Profile Launch Fails
- Verify proxy is still working
- Check proxy credentials
- Try testing the proxy again

### IP Not Changed
- Verify proxy configuration
- Check if proxy requires authentication
- Test proxy separately before using with profile

## Advanced Tips

### Multiple Proxies per Use Case
Create different proxies for different purposes:
- `Social Media Proxy` - for social platforms
- `Work Proxy` - for business activities  
- `Shopping Proxy` - for e-commerce sites

### Proxy Rotation
- Create multiple working proxies
- Switch between profiles with different proxies
- Avoid using the same proxy for all activities

### Performance Optimization
- Test proxy response times
- Use geographically close proxies for better speed
- Keep proxy list updated and remove failed ones

The new proxy system makes it much easier to manage your anonymous browsing setup while maintaining the security and anti-detect features you need!
