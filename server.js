/**
 * Local REST server for testing json-loader URL-based loading.
 *
 * Endpoints:
 *   GET /config/functionPool       → returns functionPool.json
 *   GET /apps                      → lists available app names
 *   GET /apps/:appName             → returns an individual app config
 *
 * Usage:
 *   node server.js                 → starts on port 3001 (or PORT env var)
 *   node server.js --port 8080     → starts on port 8080
 */

import { createServer } from 'http';
import { readFile, readdir } from 'fs/promises';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const DATA_DIR = join(__dirname, 'data');
const APPS_DIR = join(DATA_DIR, 'apps');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parsePort() {
    const idx = process.argv.indexOf('--port');
    if (idx !== -1 && process.argv[idx + 1]) return Number(process.argv[idx + 1]);
    return Number(process.env.PORT) || 3001;
}

function jsonResponse(res, statusCode, body) {
    const payload = JSON.stringify(body, null, 2);
    res.writeHead(statusCode, {
        'Content-Type':  'application/json',
        'Access-Control-Allow-Origin': '*',          // allow any local client
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end(payload);
}

function notFound(res, message = 'Not found') {
    jsonResponse(res, 404, { error: message });
}

// ---------------------------------------------------------------------------
// Route handlers
// ---------------------------------------------------------------------------

/** GET /config/functionPool */
async function handleFunctionPool(_req, res) {
    try {
        const raw = await readFile(join(DATA_DIR, 'functionPool.json'), 'utf-8');
        jsonResponse(res, 200, JSON.parse(raw));
    } catch (err) {
        if (err.code === 'ENOENT') return notFound(res, 'functionPool.json not found in data/');
        jsonResponse(res, 500, { error: err.message });
    }
}

/** GET /apps — list available app names */
async function handleListApps(_req, res) {
    try {
        const files = await readdir(APPS_DIR);
        const apps = files
            .filter(f => f.endsWith('.json'))
            .map(f => basename(f, '.json'));
        jsonResponse(res, 200, { apps });
    } catch (err) {
        jsonResponse(res, 500, { error: err.message });
    }
}

/** GET /apps/:appName — return a single app config */
async function handleGetApp(appName, res) {
    const filePath = join(APPS_DIR, `${appName}.json`);
    try {
        const raw = await readFile(filePath, 'utf-8');
        jsonResponse(res, 200, JSON.parse(raw));
    } catch (err) {
        if (err.code === 'ENOENT') return notFound(res, `App "${appName}" not found`);
        jsonResponse(res, 500, { error: err.message });
    }
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

async function handleRequest(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;

    // CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin':  '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        });
        return res.end();
    }

    if (req.method !== 'GET') {
        return jsonResponse(res, 405, { error: 'Method not allowed' });
    }

    // GET /config/functionPool
    if (path === '/config/functionPool') {
        return handleFunctionPool(req, res);
    }

    // GET /apps
    if (path === '/apps') {
        return handleListApps(req, res);
    }

    // GET /apps/:appName
    const appMatch = path.match(/^\/apps\/([a-zA-Z0-9_-]+)$/);
    if (appMatch) {
        return handleGetApp(appMatch[1], res);
    }

    notFound(res, `No route for ${path}`);
}

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

const PORT = parsePort();
const server = createServer(handleRequest);

server.listen(PORT, () => {
    console.log(`\n🚀  Tree-builder test server running on http://localhost:${PORT}\n`);
    console.log('Endpoints:');
    console.log(`  GET  http://localhost:${PORT}/config/functionPool`);
    console.log(`  GET  http://localhost:${PORT}/apps`);
    console.log(`  GET  http://localhost:${PORT}/apps/<appName>\n`);
    console.log('Press Ctrl+C to stop.\n');
});
