# Proxy Configuration Guide

## Common Issues and Solutions

### 1. **Tunnel Connection Failed Error**

The error `net::ERR_TUNNEL_CONNECTION_FAILED` typically occurs when:

- **Wrong Port**: Using port 80 for HTTP proxies (should be 8080, 3128, etc.)
- **Authentication Required**: Proxy requires username/password but none provided
- **Proxy Type Mismatch**: Configured as HTTP but actually SOCKS or vice versa
- **Dead Proxy**: The proxy server is no longer active

### 2. **Proper Proxy Formats**

#### HTTP Proxies
```
Host: proxy.example.com
Port: 8080 (common ports: 8080, 3128, 8888)
Type: http
Username: your_username (if required)
Password: your_password (if required)
```

#### SOCKS5 Proxies (Recommended)
```
Host: proxy.example.com
Port: 1080 (common ports: 1080, 1085)
Type: socks5
Username: your_username (if required)
Password: your_password (if required)
```

#### SOCKS4 Proxies
```
Host: proxy.example.com
Port: 1080
Type: socks4
Username: (usually not required)
Password: (usually not required)
```

### 3. **Free vs Paid Proxies**

#### Free Public Proxies (Not Recommended)
- Often unreliable and slow
- Usually blocked by major websites
- No authentication
- High failure rate
- Security risks

#### Paid Proxy Services (Recommended)
Popular reliable proxy providers:
- **Oxylabs**: Premium residential/datacenter proxies
- **BrightData**: Large pool of residential proxies
- **ProxyMesh**: Rotating datacenter proxies
- **SmartProxy**: Residential proxies
- **MyPrivateProxy**: Dedicated datacenter proxies

### 4. **Testing Your Proxies**

Before using a proxy in a profile:

1. **Use the built-in tester**: Click "Test" button next to your proxy
2. **Check response time**: Should be under 5000ms for good performance
3. **Verify IP change**: Test should show different IP than your real IP
4. **Test with websites**: Try visiting Google, YouTube, etc.

### 5. **Recommended Proxy Settings**

#### For General Browsing
```
Type: HTTP
Port: 8080 or 3128
Authentication: Yes (username/password)
```

#### For Social Media/Streaming
```
Type: SOCKS5
Port: 1080
Authentication: Yes
Rotating: Recommended
```

#### For High Anonymity
```
Type: SOCKS5
Port: 1080
Authentication: Yes
Residential: Yes
Rotating: Yes
```

### 6. **Common Port Numbers**

- **HTTP Proxies**: 8080, 3128, 8888, 80 (rare)
- **SOCKS5**: 1080, 1085
- **SOCKS4**: 1080
- **HTTPS**: 443, 8443

### 7. **Troubleshooting Steps**

1. **Verify proxy is working**:
   - Test with our built-in tester
   - Check with external tools like ProxyChecker

2. **Check authentication**:
   - Ensure username/password are correct
   - Some proxies don't require auth

3. **Try different proxy type**:
   - If HTTP fails, try SOCKS5
   - SOCKS5 is generally more reliable

4. **Verify port number**:
   - Port 80 is usually wrong for proxies
   - Try common proxy ports (8080, 3128, 1080)

5. **Check proxy provider**:
   - Contact your proxy provider
   - Verify account status and limits

### 8. **Example Working Configurations**

#### Paid Datacenter Proxy
```
Name: Datacenter US
Host: datacenter.proxyprovider.com
Port: 8080
Type: http
Username: user123
Password: pass456
```

#### Residential SOCKS5
```
Name: Residential UK
Host: residential.proxyprovider.com
Port: 1080
Type: socks5
Username: user123
Password: pass456
```

### 9. **Free Proxy Lists (Use with Caution)**

If you must use free proxies:
- **ProxyList.geonode.com**: Updated hourly
- **FreeProxyList.net**: Basic free proxies
- **ProxyScrape.com**: API for free proxies

**Warning**: Free proxies are unreliable and may compromise your privacy.

### 10. **Best Practices**

1. **Always test proxies** before using in profiles
2. **Use different proxies** for different profiles
3. **Rotate proxies regularly** to avoid detection
4. **Monitor proxy performance** and replace slow ones
5. **Use residential proxies** for social media
6. **Use datacenter proxies** for general browsing
7. **Keep backup proxies** in case primary fails

---

**Need Help?**
If you're still having issues, check:
1. Proxy provider documentation
2. Test with different websites
3. Try proxy without authentication first
4. Contact proxy provider support
