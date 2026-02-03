# treebuilder-test-server

Local REST server for testing json-loader URL-based loading.

## Features

- Serves JSON configuration files from the file system
- Returns function pool configuration
- Lists available applications
- Serves individual application configurations
- CORS-enabled for cross-origin requests
- Configurable port via command-line or environment variable

## Installation

No external dependencies required - uses Node.js built-in modules only.

## Usage

### Start the Server

Default port (3001):
```bash
npm start
```

Custom port via command-line:
```bash
node server.js --port 8080
```

Custom port via environment variable:
```bash
PORT=8080 npm start
```

### Run the Example Client

In a separate terminal:

```bash
npm run client
```

## Available Endpoints

- `GET /config/functionPool` - Returns the function pool configuration
- `GET /apps` - Lists all available application names
- `GET /apps/:appName` - Returns configuration for a specific application

## Data Directory Structure

```
data/
├── functionPool.json       # Function pool configuration
└── apps/                   # Application configurations
    ├── app1.json
    ├── app2.json
    └── demo-app.json
```

## Example Responses

### GET /config/functionPool

```json
{
  "functions": [
    {
      "id": "fn-001",
      "name": "calculateSum",
      "description": "Calculates the sum of two numbers",
      "parameters": ["a", "b"],
      "returnType": "number"
    }
  ],
  "version": "1.0.0"
}
```

### GET /apps

```json
{
  "apps": ["app1", "app2", "demo-app"]
}
```

### GET /apps/app1

```json
{
  "name": "app1",
  "displayName": "Sample Application 1",
  "version": "1.0.0",
  "config": {
    "theme": "light",
    "language": "en"
  }
}
```

## License

ISC