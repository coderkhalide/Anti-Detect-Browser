# Anti-Detect Browser MVP

A desktop anti-detect browser application built with Electron, React, and Puppeteer for anonymous browsing with spoofed fingerprints and proxy support.

## Quick Usage Guide

### Creating and Launching Profiles with Proxies

1. **Create a Profile**:
   - Click "Profiles" in the sidebar
   - Click "Add New Profile"
   - Fill in profile details including proxy (format: `ip:port` or `http://user:pass@ip:port`)
   - Save the profile

2. **Launch with Proxy**:
   - Click the play button (▶️) next to your profile
   - Browser opens with proxy and anti-fingerprint features enabled

3. **Test Your Setup**:
   - Click "Tester" in the sidebar
   - Use built-in test sites to verify proxy and anti-detect features
   - Visit sites like browserleaks.com to check fingerprint spoofing

### Proxy Configuration Examples

```
# HTTP Proxy
123.456.789.012:8080
http://123.456.789.012:8080

# With Authentication
http://username:password@123.456.789.012:8080

# SOCKS5 Proxy
socks5://123.456.789.012:1080
```

For detailed testing instructions, see [TESTING_GUIDE.md](./TESTING_GUIDE.md).

## Features

- 🔒 **Anti-Fingerprinting**: Spoof canvas, WebGL, audio, and font fingerprints
- 🌐 **Proxy Support**: HTTP, HTTPS, SOCKS4, and SOCKS5 proxy integration
- 👤 **Profile Management**: Create, edit, and manage multiple browser profiles
- 🚀 **Quick Launch**: Launch browsers with custom configurations instantly
- 🎭 **User Agent Spoofing**: Rotate between different browser user agents
- 📱 **Resolution Control**: Set custom screen resolutions per profile
- 🏷️ **Tagging System**: Organize profiles with custom tags
- 🔄 **Tab Management**: Pre-configure URLs to open in each profile

## Tech Stack

- **Frontend**: React with Vite for lightning-fast development
- **Styling**: Tailwind CSS for modern, utility-first styling
- **Desktop Shell**: Electron for cross-platform desktop app
- **Browser Automation**: Puppeteer with stealth plugins
- **Anti-Detection**: Custom fingerprint spoofing techniques
- **Storage**: Local JSON-based profile storage

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Quick Start

1. **Clone and setup the project:**
   ```bash
   cd electron-antidetect-browser
   npm install
   ```

2. **Install React dependencies:**
   ```bash
   cd src/renderer
   npm install
   cd ../..
   ```

3. **Run in development mode:**
   ```bash
   npm run dev
   ```

   This will:
   - Start the Vite development server on http://localhost:3000
   - Launch Electron which loads the React app
   - Enable hot reloading for ultra-fast development

### Production Build

```bash
# Build React app with Vite
npm run build

# Start Electron with built React app
npm start

# Or build electron distributables
npm run build:electron
```

## Project Structure

```
electron-antidetect-browser/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── main.js          # App entry point
│   │   ├── preload.js       # IPC bridge
│   │   └── profileManager.js # Profile storage
│   ├── renderer/            # React frontend with Vite
│   │   ├── src/
│   │   │   ├── components/  # UI components (Tailwind styled)
│   │   │   ├── App.js       # Main React app
│   │   │   ├── main.jsx     # Vite entry point
│   │   │   └── index.css    # Tailwind CSS styles
│   │   ├── vite.config.js   # Vite configuration
│   │   ├── tailwind.config.js # Tailwind configuration
│   │   ├── index.html       # Vite HTML template
│   │   └── package.json     # React dependencies
│   └── automation/          # Browser automation
│       └── browserLauncher.js # Puppeteer launcher
├── profile_data/            # Stored profiles (auto-created)
└── package.json             # Main dependencies
```

## Usage

### Creating a Profile

1. Click "Create New Profile" in the Profiles section
2. Fill in profile details:
   - **Name**: Descriptive name for the profile
   - **User Agent**: Browser identification string
   - **Resolution**: Screen resolution for the browser
   - **Proxy**: Optional proxy server configuration
   - **Tags**: Organize profiles with labels
   - **URLs**: Pre-configure tabs to open

### Launching a Browser

1. Navigate to the Profiles section
2. Click the "Launch Browser" button on any profile
3. A new Chromium browser window opens with:
   - Spoofed fingerprints
   - Custom user agent
   - Configured proxy (if set)
   - Pre-loaded tabs (if configured)

### Managing Proxies

1. Go to the Proxies section
2. Add proxy servers with authentication
3. Test proxy connectivity
4. Use proxies in profile configurations

## Security Features

### Anti-Fingerprinting

- **Canvas**: Adds noise to canvas fingerprints
- **WebGL**: Spoofs graphics card information
- **Audio**: Modifies audio context fingerprints
- **Fonts**: Blocks font enumeration
- **Timezone**: Standardizes timezone reporting
- **Languages**: Normalizes language preferences

### Privacy Protection

- **Isolated Profiles**: Each profile runs in complete isolation
- **No Data Leakage**: Profiles cannot access each other's data
- **Secure Communication**: IPC uses secure context isolation
- **Optional Encryption**: Profile data can be encrypted at rest

## Configuration

### Environment Variables

- `NODE_ENV`: Set to `development` for dev mode
- `ELECTRON_IS_DEV`: Automatically set in development

### Settings

Access settings through the app interface to configure:
- Default resolutions
- Maximum concurrent profiles
- Fingerprinting options
- Privacy preferences

## Development

### Running Tests

```bash
cd src/renderer
npm test
```

### Debugging

- **Electron Main Process**: Use `console.log()` output in terminal
- **React Frontend**: Use browser DevTools (auto-opens in dev mode)
- **Profile Data**: Check `profile_data/` folder for stored profiles

### Adding Features

1. **Frontend Changes**: Edit files in `src/renderer/src/` (React + Tailwind)
2. **Styling**: Use Tailwind CSS utility classes for rapid styling
3. **Backend Logic**: Modify `src/main/` files
4. **Browser Automation**: Update `src/automation/browserLauncher.js`

## Troubleshooting

### Common Issues

1. **Puppeteer Download Fails**:
   ```bash
   npm config set puppeteer_download_host=https://npm.taobao.org/mirrors
   npm install puppeteer
   ```

2. **Electron Won't Start**:
   - Ensure Vite dev server is running on port 3000
   - Check terminal for error messages

3. **Browser Launch Fails**:
   - Verify Chromium is properly installed by Puppeteer
   - Check proxy configuration if using proxies

4. **Profiles Not Saving**:
   - Ensure write permissions in project directory
   - Check `profile_data/` folder exists

### Debug Mode

Enable debug logging in Settings to see detailed operation logs.

## Roadmap

- [ ] Bulk profile creation from CSV
- [ ] Team collaboration features
- [ ] Resource monitoring dashboard
- [ ] Automated browsing scripts
- [ ] Cloud profile synchronization
- [ ] Proxy marketplace integration
- [ ] Browser session recording

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Disclaimer

This software is for educational and legitimate privacy purposes only. Users are responsible for complying with all applicable laws and website terms of service.
