// server/urls.js
const { v4: uuidv4 } = require('uuid');

const urlDatabase = {}; // In-memory storage for URL mappings

// Utility function to generate a unique shortcode
const generateShortcode = () => {
  let shortcode = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 6;
  do {
    shortcode = Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
  } while (urlDatabase[shortcode]);
  return shortcode;
};

// Function to store a new URL mapping
const addUrl = ({ originalUrl, preferredShortcode, validityInMinutes }) => {
  let shortcode = preferredShortcode || generateShortcode();

  if (urlDatabase[shortcode]) {
    return { error: 'Shortcode collision. Please try a different one.' };
  }

  const creationDate = new Date();
  const expiryDate = new Date(creationDate.getTime() + (validityInMinutes * 60 * 1000));

  urlDatabase[shortcode] = {
    originalUrl,
    creationDate,
    expiryDate,
    clicks: [],
  };

  return { shortcode, creationDate, expiryDate };
};

// Function to get a URL by shortcode
const getUrl = (shortcode) => {
  const urlEntry = urlDatabase[shortcode];
  if (!urlEntry) {
    return null;
  }
  const now = new Date();
  if (now > new Date(urlEntry.expiryDate)) {
    delete urlDatabase[shortcode]; // Clean up expired URLs
    return null;
  }
  return urlEntry;
};

// Function to log a click
const logClick = (shortcode, clickData) => {
  if (urlDatabase[shortcode]) {
    urlDatabase[shortcode].clicks.push(clickData);
  }
};

module.exports = {
  addUrl,
  getUrl,
  logClick,
  urlDatabase,
};