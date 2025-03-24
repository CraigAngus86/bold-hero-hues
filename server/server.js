
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const scraper = require('./scraper');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Optional: Simple API key validation middleware
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const configuredApiKey = process.env.API_KEY;
  
  // If no API key is configured, skip validation
  if (!configuredApiKey) {
    return next();
  }
  
  // Validate API key
  if (!apiKey || apiKey !== configuredApiKey) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  next();
};

// Cache for storing scraped data
let cachedLeagueTable = null;
let lastUpdated = null;

// Function to update the cache
const updateCache = async () => {
  try {
    console.log('Updating cache with fresh data from BBC Sport');
    const data = await scraper.scrapeLeagueTable();
    cachedLeagueTable = data;
    lastUpdated = new Date();
    console.log('Cache updated successfully');
  } catch (error) {
    console.error('Error updating cache:', error);
  }
};

// Initially populate the cache
updateCache();

// Schedule cache update every 6 hours
cron.schedule('0 */6 * * *', () => {
  console.log('Running scheduled cache update');
  updateCache();
});

// Endpoint to get the league table
app.get('/api/league-table', validateApiKey, async (req, res) => {
  try {
    // Check if force refresh is requested
    const forceRefresh = req.query.refresh === 'true';
    
    if (forceRefresh || !cachedLeagueTable) {
      console.log('Force refreshing or no cached data available');
      await updateCache();
    }
    
    res.json({
      leagueTable: cachedLeagueTable,
      lastUpdated: lastUpdated ? lastUpdated.toISOString() : null
    });
  } catch (error) {
    console.error('Error fetching league table:', error);
    res.status(500).json({ error: 'Failed to fetch league table' });
  }
});

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    lastUpdated: lastUpdated ? lastUpdated.toISOString() : null,
    hasData: !!cachedLeagueTable
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
