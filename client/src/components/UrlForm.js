// client/src/components/UrlForm.js
import React, { useState } from 'react';
import { shortenUrl } from '../api';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Snackbar,
} from '@mui/material';
import UrlList from './UrlList'; // <-- Add this line

const UrlForm = ({ onUrlShortened }) => {
  const [urls, setUrls] = useState([{ longUrl: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (index, event) => {
    const newUrls = [...urls];
    const { name, value } = event.target;
    newUrls[index][name] = value;
    setUrls(newUrls);
  };

  const addUrlField = () => {
    if (urls.length < 5) {
      setUrls([...urls, { longUrl: '', validity: '', shortcode: '' }]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const newResults = [];

    for (const url of urls) {
      if (!url.longUrl || !isValidUrl(url.longUrl)) {
        setError('Please enter a valid URL.');
        setSnackbarOpen(true);
        return;
      }
      if (url.validity && isNaN(parseInt(url.validity))) {
        setError('Validity must be a number in minutes.');
        setSnackbarOpen(true);
        return;
      }

      try {
        const response = await shortenUrl({
          originalUrl: url.longUrl,
          preferredShortcode: url.shortcode || undefined,
          validityInMinutes: url.validity ? parseInt(url.validity) : undefined,
        });
        newResults.push({ originalUrl: url.longUrl, ...response });
      } catch (err) {
        setError(err.message);
        setSnackbarOpen(true);
        return;
      }
    }
    setResults(newResults);
    onUrlShortened(newResults); // Pass results to parent component for state update
  };

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      <Typography variant="h5">Shorten URLs</Typography>
      {urls.map((url, index) => (
        <Paper key={index} elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Original Long URL"
            name="longUrl"
            value={url.longUrl}
            onChange={(e) => handleInputChange(index, e)}
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Optional Validity Period (minutes)"
            name="validity"
            type="number"
            value={url.validity}
            onChange={(e) => handleInputChange(index, e)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Optional Preferred Shortcode"
            name="shortcode"
            value={url.shortcode}
            onChange={(e) => handleInputChange(index, e)}
            InputLabelProps={{ shrink: true }}
          />
        </Paper>
      ))}
      <Button onClick={addUrlField} disabled={urls.length >= 5} variant="outlined">
        Add Another URL ({urls.length}/5)
      </Button>
      <Button type="submit" variant="contained">
        Shorten
      </Button>
      {results.length > 0 && <UrlList urls={results} />}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UrlForm;