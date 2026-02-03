import http from 'http';
import url from 'url';

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

// Additional test endpoints
const endpoints = {
  '/api/tree': sampleData,
  '/api/status': { status: 'ok', timestamp: new Date().toISOString() },
  '/api/data': { message: 'Hello from treebuilder-test-server', data: [1, 2, 3, 4, 5] }
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

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
    if (endpoints[pathname]) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(endpoints[pathname], null, 2));
      console.log(`✓ Served ${pathname}`);
    } else if (pathname === '/') {
      // Root endpoint - list available endpoints
      res.writeHead(200, { 'Content-Type': 'application/json' });
      const availableEndpoints = {
        message: 'treebuilder-test-server',
        endpoints: Object.keys(endpoints),
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
  Object.keys(endpoints).forEach(endpoint => {
    console.log(`   - http://localhost:${PORT}${endpoint}`);
  });
});
