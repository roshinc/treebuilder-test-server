# treebuilder-test-server

A local REST server for testing the `json-loader.js` URL-based loading functions (`loadFromUrl`, `loadAppFromUrl`, `loadFunctionPool`).

## Quick Start

```bash
# Terminal 1 – start the server
node server.js

# Terminal 2 – run the example client
node example-client.js
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/config/functionPool` | Returns the full function pool JSON |
| `GET` | `/apps` | Lists available app names |
| `GET` | `/apps/:appName` | Returns a single app config by name |

### Examples

```bash
# List apps
curl http://localhost:3001/apps

# Get function pool
curl http://localhost:3001/config/functionPool

# Get a specific app
curl http://localhost:3001/apps/nims-wt-pend-process-app
```

## Configuration

**Port** – defaults to `3001`. Override with:

```bash
# env var
PORT=8080 node server.js

# CLI flag
node server.js --port 8080
```

**Server URL for client** – the example client defaults to `http://localhost:3001`. Override with:

```bash
SERVER_URL=http://localhost:8080 node example-client.js
```

## Project Structure

```
test-server/
├── server.js            # REST server (zero dependencies)
├── example-client.js    # Demo client using json-loader URL functions
├── tree-builder.js      # Core TreeBuilder (copied from main project)
├── json-loader.js       # JSON loader with URL support
├── data/                # Data served by the REST server
│   ├── functionPool.json
│   └── apps/
│       ├── nims-exceptions-app.json
│       ├── nims-wt-pend-process-app.json
│       ├── nims-wt-wage-process-app.json
│       └── nims-wt-file-process-app.json
└── config/              # Same data in config/ layout (for file-based loading)
    ├── functionPool.json
    └── apps/
        └── ...
```

## Using with json-loader

```javascript
import { TreeBuilder } from './tree-builder.js';
import { loadAppFromUrl, loadFunctionPool } from './json-loader.js';

const BASE = 'http://localhost:3001';

// Load function pool from server
const functionPool = await loadFunctionPool(`${BASE}/config/functionPool`);

// Load a single app config by name
const appConfig = await loadAppFromUrl(`${BASE}/apps/nims-wt-pend-process-app`);

// Build the tree
const builder = new TreeBuilder();
builder.defineFunctions(functionPool);
const tree = await builder.build(appConfig);
```
