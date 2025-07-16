const BrowserLauncher = require('./src/automation/browserLauncher');

async function testBrowserLauncher() {
  console.log('Testing browser launcher...');
  
  const launcher = new BrowserLauncher();
  
  const testProfile = {
    id: 'test-profile-123',
    name: 'Test Profile',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
    proxy: '',
    resolution: '1920x1080',
    tags: [],
    cookies: '',
    tabs: ['https://www.google.com'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'stopped'
  };

  try {
    console.log('Launching browser...');
    const result = await launcher.launchBrowser(testProfile);
    console.log('Launch result:', result);
    
    // Wait 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('Stopping browser...');
    const stopResult = await launcher.stopBrowser(testProfile.id);
    console.log('Stop result:', stopResult);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testBrowserLauncher().then(() => {
  console.log('Test completed');
  process.exit(0);
}).catch(error => {
  console.error('Test error:', error);
  process.exit(1);
});
