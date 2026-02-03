import http from 'http';

const BASE_URL = 'http://localhost:3001';

// Helper function to make HTTP GET requests
function fetchData(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${endpoint}`;
    
    http.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse JSON: ${e.message}`));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Main function to test the server
async function testServer() {
  console.log('🧪 Testing treebuilder-test-server...\n');

  // Test 1: GET /config/functionPool
  try {
    console.log('Testing GET /config/functionPool...');
    const functionPool = await fetchData('/config/functionPool');
    console.log('✓ Response received:');
    console.log(JSON.stringify(functionPool, null, 2));
    console.log('');
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.log('');
  }

  // Test 2: GET /apps (list all apps)
  try {
    console.log('Testing GET /apps...');
    const appsList = await fetchData('/apps');
    console.log('✓ Response received:');
    console.log(JSON.stringify(appsList, null, 2));
    console.log('');

    // Test 3: GET individual apps
    if (appsList.apps && appsList.apps.length > 0) {
      for (const appName of appsList.apps.slice(0, 2)) { // Test first 2 apps
        try {
          console.log(`Testing GET /apps/${appName}...`);
          const appData = await fetchData(`/apps/${appName}`);
          console.log('✓ Response received:');
          console.log(JSON.stringify(appData, null, 2));
          console.log('');
        } catch (error) {
          console.error(`✗ Error testing /apps/${appName}:`, error.message);
          console.log('');
        }
      }
    }
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.log('');
  }

  // Test 4: Test non-existent endpoint (should return 404)
  try {
    console.log('Testing GET /apps/non-existent (expect 404)...');
    await fetchData('/apps/non-existent');
  } catch (error) {
    console.log('✓ Expected error:', error.message);
    console.log('');
  }

  console.log('✅ Tests completed!');
  console.log('\nNote: Make sure the server is running (npm start) before running this client.');
}

// Check if server is running before testing
console.log('Checking if server is running...\n');
testServer().catch(err => {
  console.error('❌ Failed to connect to server:', err.message);
  console.log('\n💡 Start the server first with: npm start');
  process.exit(1);
});
