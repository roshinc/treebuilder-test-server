import http from 'http';

const PORT = 3000;

// Sample JSON data for testing
const sampleData = {
  tree: {
    name: "root",
    children: [
      {
        name: "branch1",
        children: [
          { name: "leaf1" },
          { name: "leaf2" }
        ]
      },
      {
        name: "branch2",
        children: [
          { name: "leaf3" }
        ]
      }
    ]
  }
};

// Static test data
const staticData = {
  '/api/tree': sampleData,
  '/api/data': { message: 'Hello from treebuilder-test-server', data: [1, 2, 3, 4, 5] }
};

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = requestUrl.pathname;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle GET requests
  if (req.method === 'GET') {
    if (pathname === '/api/status') {
      // Generate status with current timestamp
      const statusData = { status: 'ok', timestamp: new Date().toISOString() };
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(statusData, null, 2));
      console.log(`✓ Served ${pathname}`);
    } else if (staticData[pathname]) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(staticData[pathname], null, 2));
      console.log(`✓ Served ${pathname}`);
    } else if (pathname === '/') {
      // Root endpoint - list available endpoints
      res.writeHead(200, { 'Content-Type': 'application/json' });
      const availableEndpoints = {
        message: 'treebuilder-test-server',
        endpoints: ['/api/tree', '/api/status', '/api/data'],
        usage: 'GET /api/tree, /api/status, or /api/data'
      };
      res.end(JSON.stringify(availableEndpoints, null, 2));
      console.log(`✓ Served root endpoint`);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found', path: pathname }, null, 2));
      console.log(`✗ 404: ${pathname}`);
    }
  } else {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method Not Allowed' }, null, 2));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 treebuilder-test-server running on http://localhost:${PORT}`);
  console.log(`📍 Available endpoints:`);
  const allEndpoints = ['/api/tree', '/api/status', '/api/data'];
  allEndpoints.forEach(endpoint => {
    console.log(`   - http://localhost:${PORT}${endpoint}`);
  });
});
