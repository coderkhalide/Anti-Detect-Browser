# Anti-Detect Browser Testing Guide

## How to Launch Profiles with Proxies

### 1. Creating a Profile with Proxy

1. **Go to Profiles Section**: Click on "Profiles" in the sidebar
2. **Create New Profile**: Click "Add New Profile"
3. **Configure Profile Settings**:
   - **Name**: Give your profile a descriptive name
   - **User Agent**: Select or enter a user agent string
   - **Proxy**: Enter your proxy in one of these formats:
     - `ip:port` (for HTTP proxies)
     - `http://ip:port`
     - `socks5://ip:port`
     - `http://username:password@ip:port` (with authentication)
   - **Resolution**: Choose screen resolution
   - **Tags**: Add tags for organization
   - **Tabs**: Enter URLs to open automatically (one per line)

4. **Save Profile**: Click "Save Profile"

### 2. Launching the Profile

1. **Find Your Profile**: In the profiles list, locate your profile
2. **Launch**: Click the "Play" button (▶️) next to your profile
3. **Browser Opens**: A new browser window will open with:
   - Your specified proxy configuration
   - Custom user agent
   - Spoofed fingerprints
   - Pre-opened tabs (if configured)

### 3. Proxy Configuration Examples

```
# HTTP Proxy (no authentication)
123.456.789.012:8080
http://123.456.789.012:8080

# HTTP Proxy (with authentication)
http://username:password@123.456.789.012:8080

# SOCKS5 Proxy
socks5://123.456.789.012:1080
socks5://username:password@123.456.789.012:1080
```

## Testing Anti-Detect Functionality

### Quick Test Methods

#### 1. **Use the Built-in Tester**
- Click "Tester" in the sidebar
- Use the "Run Automated Test" for quick verification
- Click on individual test sites for manual testing

#### 2. **Essential Test Websites**

**IP/Proxy Testing:**
- https://whatismyipaddress.com - Check if your real IP is hidden
- https://iplocation.net - Verify proxy location
- https://ipinfo.io - Detailed IP information

**Fingerprint Testing:**
- https://browserleaks.com - Comprehensive fingerprint analysis
- https://amiunique.org/fp - Browser uniqueness test
- https://pixelscan.net - Advanced bot detection

**Specific Fingerprint Components:**
- https://browserleaks.com/canvas - Canvas fingerprinting
- https://browserleaks.com/webgl - WebGL fingerprinting
- https://audiofingerprint.openwpm.com - Audio fingerprinting

**Bot Detection:**
- https://bot.sannysoft.com - Bot detection test
- https://intoli.com/blog/not-possible-to-block-chrome-headless/ - Headless detection

### What to Check

#### ✅ Proxy Verification
1. **IP Address**: Should show proxy IP, not your real IP
2. **Location**: Should match proxy server location
3. **ISP**: Should show proxy provider, not your ISP

#### ✅ Fingerprint Spoofing
1. **User Agent**: Should match your profile configuration
2. **Screen Resolution**: Should match profile settings
3. **Canvas Fingerprint**: Should be different each time (if noise is enabled)
4. **WebGL Fingerprint**: Should be spoofed/blocked
5. **Audio Context**: Should be modified/blocked

#### ✅ Bot Detection Resistance
1. **Webdriver Property**: Should be undefined/hidden
2. **Automation Flags**: Should not detect automation
3. **Timing Attacks**: Should appear human-like
4. **Plugin Detection**: Should show realistic plugin list

### Testing Workflow

#### Step 1: Test Without Profile
1. Open a regular browser
2. Visit test sites and note your real fingerprint
3. Record your real IP address and location

#### Step 2: Test With Profile
1. Launch your anti-detect profile
2. Visit the same test sites
3. Compare results:
   - IP should be different (if using proxy)
   - Fingerprints should be spoofed
   - No bot detection warnings

#### Step 3: Multiple Profile Testing
1. Create several profiles with different settings
2. Test each profile separately
3. Verify each has a unique fingerprint
4. Ensure profiles are isolated from each other

### Red Flags to Watch For

❌ **Failed Proxy**:
- Real IP address still visible
- Location matches your actual location
- DNS leaks showing real ISP

❌ **Fingerprint Leaks**:
- Same canvas fingerprint across sessions
- Real hardware information visible
- Webdriver property detected

❌ **Bot Detection**:
- Sites detecting automation
- Blocked by anti-bot systems
- Unusual timing patterns detected

### Troubleshooting Common Issues

#### Proxy Not Working
1. **Check Proxy Format**: Ensure correct format (ip:port)
2. **Test Proxy Separately**: Use proxy testing tools
3. **Check Authentication**: Verify username/password if required
4. **Try Different Proxy Type**: Switch between HTTP/SOCKS5

#### Fingerprint Detection
1. **Update User Agent**: Use recent, common user agents
2. **Check Resolution**: Use common screen resolutions
3. **Clear Browser Data**: Start with clean profile
4. **Verify Anti-Fingerprint Settings**: Enable all protection features

#### Bot Detection
1. **Use Realistic Settings**: Avoid unusual configurations
2. **Add Human-like Delays**: Don't navigate too quickly
3. **Use Common Extensions**: Add realistic browser extensions
4. **Vary Behavior**: Don't follow exact patterns

### Advanced Testing

#### Fingerprint Consistency Testing
1. Visit browserleaks.com multiple times
2. Check if fingerprint elements change appropriately
3. Verify canvas noise is working (slight variations)
4. Confirm WebGL spoofing is consistent

#### Long-term Tracking Resistance
1. Close and reopen profile multiple times
2. Test if tracking cookies persist incorrectly
3. Verify profile isolation between sessions
4. Check for cross-profile data leakage

#### Performance Testing
1. Test with multiple concurrent profiles
2. Monitor system resource usage
3. Verify proxy connection stability
4. Check for browser crashes or hangs

### Best Practices

1. **Regular Testing**: Test profiles periodically as detection methods evolve
2. **Update Fingerprints**: Refresh user agents and other identifiers regularly
3. **Rotate Proxies**: Use different proxies for different sessions
4. **Profile Isolation**: Never share data between different profiles
5. **Realistic Behavior**: Act like a normal user, not a bot

### Professional Verification Services

For professional use cases, consider using these verification services:
- **MultiLogin Fingerprint Test**: Professional-grade testing
- **GoLogin Checker**: Anti-detect verification tools
- **Custom Testing Scripts**: Automated fingerprint analysis

Remember: Anti-detect technology is an ongoing arms race. Regular testing and updates are essential to maintain effectiveness.
