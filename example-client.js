import http from 'http';

const BASE_URL = 'http://localhost:3000';

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

  const endpoints = ['/api/tree', '/api/status', '/api/data', '/'];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint}...`);
      const data = await fetchData(endpoint);
      console.log('✓ Response received:');
      console.log(JSON.stringify(data, null, 2));
      console.log('');
    } catch (error) {
      console.error(`✗ Error testing ${endpoint}:`, error.message);
      console.log('');
    }
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
