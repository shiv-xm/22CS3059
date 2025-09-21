// server/index.js
const express = require('express');
const cors = require('cors');
const customLogger = require('./logger');
const { addUrl, getUrl, logClick, urlDatabase } = require('./urls');

const app = express();
const port = 3001; // Use a different port than the React app

app.use(cors());
app.use(express.json());
app.use(customLogger);

// API endpoint to shorten a URL
app.post('/api/shorten', (req, res) => {
  const { originalUrl, preferredShortcode, validityInMinutes } = req.body;
  const result = addUrl({
    originalUrl,
    preferredShortcode,
    validityInMinutes: validityInMinutes || 30, 
  });

  if (result.error) {
    return res.status(409).json(result);
  }
  res.status(201).json(result);
});

// API endpoint to get all shortened URLs
app.get('/api/stats', (req, res) => {
  const stats = Object.entries(urlDatabase).map(([shortcode, data]) => ({
    shortcode,
    originalUrl: data.originalUrl,
    creationDate: data.creationDate,
    expiryDate: data.expiryDate,
    totalClicks: data.clicks.length,
    detailedClicks: data.clicks,
  }));
  res.json(stats);
});

// Redirection endpoint
app.get('/redirect/:shortcode', (req, res) => {
  const { shortcode } = req.params;
  const urlEntry = getUrl(shortcode);

  if (!urlEntry) {
    return res.status(404).send('URL not found or has expired.');
  }

  // Log the click
  const clickData = {
    timestamp: new Date(),
    source: req.headers.referer || 'direct',
    location: 'coarse-grained location (e.g., from IP lookup)',
  };
  logClick(shortcode, clickData);

  res.redirect(urlEntry.originalUrl);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});