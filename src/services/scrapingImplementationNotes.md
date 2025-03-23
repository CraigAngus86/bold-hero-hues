
# Highland Football League Scraping Implementation Notes

This document outlines the approach for scraping data from the Highland Football League website to populate our fixtures, results, and league table sections.

## Overview

The current implementation provides a framework and placeholders for scraping the Highland Football League website. In a production environment, the actual scraping would be done server-side due to CORS restrictions and to avoid overloading the client.

## Full Implementation Steps

1. **Create a Backend API:**
   - Set up a Node.js server with Express
   - Create API endpoints for fetching league data, fixtures, and results
   - Implement proper error handling and rate limiting

2. **Scraping Implementation:**
   - Use libraries like Cheerio or Puppeteer to parse the HTML
   - For the RSS feed, use a library like xml2js
   - Extract the relevant data from the parsed HTML/XML

3. **Data Processing:**
   - Clean and normalize the data to match our application's data structures
   - Add team logos and other metadata that might not be available in the scraped data
   - Ensure proper sorting and filtering of the data

4. **Data Storage:**
   - Store the scraped data in a database (e.g., MongoDB, PostgreSQL)
   - Implement a caching mechanism to avoid unnecessary scraping

5. **Scheduled Jobs:**
   - Set up cron jobs to periodically scrape the website for updates
   - Implement logic to only update changed data

6. **Frontend Integration:**
   - Update the frontend to fetch data from our API instead of using mock data
   - Implement proper loading states and error handling

## Example Scraping Code (Server-side)

```javascript
const axios = require('axios');
const cheerio = require('cheerio');
const xml2js = require('xml2js');

// Fetch and parse the league table
async function scrapeLeagueTable() {
  try {
    const { data } = await axios.get('http://www.highlandfootballleague.com/table');
    const $ = cheerio.load(data);
    const teams = [];

    // Select the table rows and extract the data
    $('table.league-table tbody tr').each((i, el) => {
      const tds = $(el).find('td');
      
      teams.push({
        position: parseInt($(tds[0]).text().trim()),
        team: $(tds[1]).text().trim(),
        played: parseInt($(tds[2]).text().trim()),
        won: parseInt($(tds[3]).text().trim()),
        drawn: parseInt($(tds[4]).text().trim()),
        lost: parseInt($(tds[5]).text().trim()),
        goalsFor: parseInt($(tds[6]).text().trim()),
        goalsAgainst: parseInt($(tds[7]).text().trim()),
        goalDifference: parseInt($(tds[8]).text().trim()),
        points: parseInt($(tds[9]).text().trim()),
        form: parseFormString($(tds[10]).text().trim())
      });
    });

    return teams;
  } catch (error) {
    console.error('Error scraping league table:', error);
    throw error;
  }
}

// Fetch and parse the fixtures
async function scrapeFixtures() {
  // Similar implementation as scrapeLeagueTable
}

// Fetch and parse the results
async function scrapeResults() {
  // Similar implementation as scrapeLeagueTable
}

// Parse the RSS feed
async function parseRSSFeed() {
  try {
    const { data } = await axios.get('http://www.highlandfootballleague.com/feed');
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(data);
    
    // Extract and process the RSS items
    const items = result.rss.channel[0].item;
    
    return items.map(item => ({
      title: item.title[0],
      link: item.link[0],
      description: item.description[0],
      pubDate: item.pubDate[0],
      // Extract other relevant fields
    }));
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
    throw error;
  }
}

// Helper function to parse the form string into an array
function parseFormString(formString) {
  return formString.split('').map(char => {
    if (char === 'W') return 'W';
    if (char === 'D') return 'D';
    if (char === 'L') return 'L';
    return null;
  }).filter(Boolean);
}

module.exports = {
  scrapeLeagueTable,
  scrapeFixtures,
  scrapeResults,
  parseRSSFeed
};
```

## API Endpoints

```javascript
const express = require('express');
const { scrapeLeagueTable, scrapeFixtures, scrapeResults } = require('./scraper');

const app = express();
const PORT = process.env.PORT || 3001;

// Endpoint to get the league table
app.get('/api/league-table', async (req, res) => {
  try {
    const data = await scrapeLeagueTable();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch league table' });
  }
});

// Endpoint to get the fixtures
app.get('/api/fixtures', async (req, res) => {
  try {
    const data = await scrapeFixtures();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fixtures' });
  }
});

// Endpoint to get the results
app.get('/api/results', async (req, res) => {
  try {
    const data = await scrapeResults();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// Endpoint to get all data at once
app.get('/api/league-data', async (req, res) => {
  try {
    const [leagueTable, fixtures, results] = await Promise.all([
      scrapeLeagueTable(),
      scrapeFixtures(),
      scrapeResults()
    ]);
    
    res.json({
      leagueTable,
      fixtures,
      results
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch league data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Next Steps

1. Implement the server-side scraping logic as outlined above
2. Deploy the API to a hosting provider (e.g., Vercel, Netlify, AWS)
3. Update the frontend to fetch data from the API
4. Set up scheduled jobs to keep the data up to date
