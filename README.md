# treebuilder-test-server

Local REST server for testing json-loader URL loading.

## Features

- Simple HTTP REST API server
- Returns JSON responses for testing
- CORS-enabled for cross-origin requests
- Multiple test endpoints with sample data

## Installation

No external dependencies required - uses Node.js built-in modules only.

## Usage

### Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

### Run the Example Client

In a separate terminal:

```bash
npm run client
```

## Available Endpoints

- `GET /` - List available endpoints
- `GET /api/tree` - Returns a sample tree structure
- `GET /api/status` - Returns server status
- `GET /api/data` - Returns sample data array

## Example Response

```json
{
  "tree": {
    "name": "root",
    "children": [
      {
        "name": "branch1",
        "children": [
          { "name": "leaf1" },
          { "name": "leaf2" }
        ]
      }
    ]
  }
}
```

## License

ISC