# Free Proxy Resources

## ⚠️ Important Disclaimer

**Use free proxies at your own risk!** Free proxies often have:
- Security vulnerabilities
- Data logging and privacy issues
- Unreliable connections
- Slow speeds
- Potential malware injection

**For production use, always use paid, reputable proxy services.**

## Current Free Proxy Lists (Updated July 2025)

### HTTP/HTTPS Proxies
```
# US Proxies
104.248.90.212:80
167.172.109.12:46437
198.49.68.80:80
45.76.43.71:1080

# European Proxies
185.217.143.96:80
91.107.6.115:53281
77.46.138.233:33608

# Asian Proxies
103.216.207.15:8080
8.210.83.33:80
47.74.152.29:8888
```

### SOCKS5 Proxies
```
# SOCKS5 (often more reliable)
72.195.114.169:4145
98.162.25.29:31679
192.252.208.67:14287
24.249.199.12:4145
```

## Best Free Proxy Sources

### 1. **FreeProxyList.net**
- URL: https://free-proxy-list.net
- Updates: Multiple times daily
- Filters: Country, anonymity level, HTTPS support
- Format: IP:Port with additional info

### 2. **ProxyScrape**
- URL: https://proxyscrape.com/free-proxy-list
- API Available: Yes (limited free tier)
- Formats: TXT, CSV, JSON
- Types: HTTP, SOCKS4, SOCKS5

### 3. **GeoNode Free Proxies**
- URL: https://geonode.com/free-proxy-list
- Features: Geographic filtering
- Updates: Daily
- Quality: Generally better than average

### 4. **ProxyList.geonode.com**
- URL: https://proxylist.geonode.com
- Filters: Country, speed, uptime
- Export: Multiple formats
- Testing: Built-in proxy checker

### 5. **SpyProxy.net**
- URL: https://spyproxy.net
- Focus: Anonymous proxies
- Categories: Elite, Anonymous, Transparent
- Updates: Regular

## API Sources for Automated Collection

### ProxyScrape API (Free Tier)
```bash
# Get HTTP proxies
curl "https://api.proxyscrape.com/v2/?request=get&protocol=http&timeout=5000&country=all&ssl=all&anonymity=all"

# Get SOCKS5 proxies
curl "https://api.proxyscrape.com/v2/?request=get&protocol=socks5&timeout=5000&country=all"
```

### GitHub Proxy Lists
Many developers maintain updated proxy lists on GitHub:
- Search for "free-proxy-list"
- Look for recently updated repositories
- Check commit frequency for reliability

## Proxy Testing Tools

### Online Testers
- **Proxy-Checker.net**: Bulk proxy testing
- **CheckProxyLive.com**: Real-time proxy validation
- **ProxyChecker.org**: Multi-threaded testing

### Command Line Testing
```bash
# Test HTTP proxy
curl -x http://proxy_ip:port -I http://httpbin.org/ip

# Test SOCKS5 proxy
curl --socks5-hostname proxy_ip:port http://httpbin.org/ip

# Test with timeout
curl -x http://proxy_ip:port --connect-timeout 10 http://httpbin.org/ip
```

## Recommended Paid Alternatives

When you're ready to upgrade from free proxies:

### Budget-Friendly Options
- **Webshare.io**: $2.99/month for 10 proxies
- **ProxyEmpire**: Pay-as-you-go pricing
- **IPRoyal**: Starting at $1.75/GB

### Professional Services
- **Bright Data**: Enterprise-grade, expensive but reliable
- **Oxylabs**: High-quality residential proxies
- **Smartproxy**: Good balance of price and quality
- **NetNut**: Fast datacenter and residential proxies

## Usage Tips

### For Testing
1. Always test proxies before use
2. Check response time and reliability
3. Verify the proxy's location matches your needs
4. Test with your target websites

### For Production
1. Use rotating proxy pools
2. Implement failover mechanisms
3. Monitor proxy health continuously
4. Have backup proxy sources

### Security Best Practices
1. Never send sensitive data through free proxies
2. Use HTTPS when possible
3. Implement additional encryption layers
4. Monitor for data leaks
5. Regularly rotate proxy sources

## Proxy Formats

### Standard Formats
```
# Basic HTTP
ip:port

# HTTP with protocol
http://ip:port

# With authentication
http://username:password@ip:port

# SOCKS5
socks5://ip:port

# SOCKS5 with auth
socks5://username:password@ip:port
```

### For Different Tools
```javascript
// Puppeteer/Chrome
--proxy-server=http://ip:port

// cURL
-x http://ip:port

// Python requests
proxies = {
  'http': 'http://ip:port',
  'https': 'http://ip:port'
}
```

## Troubleshooting Common Issues

### Connection Failures
- Try different proxy types (HTTP vs SOCKS5)
- Check if proxy requires authentication
- Verify proxy is still active
- Test with simple HTTP requests first

### Slow Performance
- Test multiple proxies and use the fastest
- Use proxies geographically closer to you
- Avoid overloaded free proxy servers
- Consider paid alternatives for better speed

### Access Blocked
- Some sites block known proxy IPs
- Try residential proxies instead of datacenter
- Rotate between different proxy sources
- Use proxies from different countries

Remember: Free proxies are best for testing and development. For any serious use case, invest in reliable paid proxy services.
