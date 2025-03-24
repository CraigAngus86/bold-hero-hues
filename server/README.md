
# Highland League Scraper Server

This Node.js server scrapes the BBC Sport Highland League table and provides it via a REST API for the Banks o' Dee FC website.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file from the example:
   ```
   cp .env.example .env
   ```

3. Edit the `.env` file with your configuration settings.

## Running the server

Development mode with auto-restart:
```
npm run dev
```

Production mode:
```
npm start
```

## API Endpoints

- `GET /api/league-table` - Returns the latest Highland League table
  - Query params:
    - `refresh=true` - Forces a fresh scrape from BBC Sport

- `GET /api/status` - Returns server status information

## Security

If you want to secure the API endpoints, set an API key in the `.env` file and include it in your requests as the `X-API-Key` header.

## Scheduling

The server automatically updates the league table data every 6 hours. You can modify this schedule in the `server.js` file.
