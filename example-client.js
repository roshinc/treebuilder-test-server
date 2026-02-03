/**
 * Example client that loads configs from the local REST server.
 *
 * Start the server first:   node server.js
 * Then run this:            node example-client.js
 */

import { TreeBuilder } from './tree-builder.js';
import { loadFromUrl, loadAppFromUrl, loadFunctionPool } from './json-loader.js';

const BASE_URL = process.env.SERVER_URL || 'http://localhost:3001';

async function main() {
    console.log('Tree Builder – REST Client Example\n');
    console.log(`Server: ${BASE_URL}\n`);

    // -----------------------------------------------------------------------
    // 1. List available apps
    // -----------------------------------------------------------------------
    console.log('Fetching available apps...');
    const { apps } = await loadFromUrl(`${BASE_URL}/apps`);
    console.log('Available apps:');
    apps.forEach(a => console.log(`  - ${a}`));

    // -----------------------------------------------------------------------
    // 2. Load the shared function pool
    // -----------------------------------------------------------------------
    console.log('\nLoading function pool from REST endpoint...');
    const functionPool = await loadFunctionPool(`${BASE_URL}/config/functionPool`);
    const funcCount = Object.keys(functionPool).length;
    console.log(`Loaded ${funcCount} function definitions`);

    // -----------------------------------------------------------------------
    // 3. Build a tree for a single app
    // -----------------------------------------------------------------------
    const appName = 'nims-wt-pend-process-app';
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Loading app config: ${appName}`);
    console.log('='.repeat(60));

    const appConfig = await loadAppFromUrl(`${BASE_URL}/apps/${appName}`);
    console.log(`App loaded: ${appConfig.name}  (type: ${appConfig.type})`);

    const builder = new TreeBuilder();
    builder.defineFunctions(functionPool);

    const tree = await builder.build(appConfig);
    console.log('\nResolved tree:');
    console.log(JSON.stringify(tree, null, 2));

    // -----------------------------------------------------------------------
    // 4. Build trees for every app
    // -----------------------------------------------------------------------
    console.log(`\n${'='.repeat(60)}`);
    console.log('Building trees for all apps');
    console.log('='.repeat(60));

    for (const name of apps) {
        const config = await loadAppFromUrl(`${BASE_URL}/apps/${name}`);
        const appTree = await builder.build(config);

        const childCount = appTree.children?.length || 0;
        const funcs      = appTree.children?.filter(c => c.type === 'function').length || 0;
        const services   = appTree.children?.filter(c => c.type === 'ui-services').length || 0;

        console.log(`\n${name}:`);
        console.log(`  Direct children: ${childCount}`);
        console.log(`  - Function refs: ${funcs}`);
        console.log(`  - UI Services:   ${services}`);
    }

    // -----------------------------------------------------------------------
    // 5. Demo with Authorization header (simulating protected endpoint)
    // -----------------------------------------------------------------------
    console.log('\n--- Fetch with custom headers (auth demo) ---');
    const poolAgain = await loadFunctionPool(`${BASE_URL}/config/functionPool`, {
        headers: { 'Authorization': 'Bearer test-token-123' }
    });
    console.log(`Fetched with auth header – ${Object.keys(poolAgain).length} functions`);

    console.log('\nDone!');
}

main().catch(err => {
    console.error('Error:', err.message);
    console.error('\nMake sure the server is running:  node server.js');
    process.exit(1);
});
