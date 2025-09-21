// client/src/components/StatsPage.js
import React, { useState, useEffect } from 'react';
import { getStats } from '../api';
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const StatsPage = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (err) {
        setError('Failed to fetch statistics. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error" sx={{ p: 4 }}>{error}</Typography>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        URL Shortener Statistics
      </Typography>
      {stats.length === 0 ? (
        <Typography variant="body1">No shortened URLs to display statistics for.</Typography>
      ) : (
        <List>
          {stats.map((url, index) => (
            <Paper key={index} elevation={3} sx={{ mb: 2 }}>
              <ListItem alignItems="flex-start" disableGutters>
                <Accordion sx={{ width: '100%' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6">
                        <Link href={`http://localhost:3000/redirect/${url.shortcode}`} target="_blank" rel="noopener">
                          {url.shortcode}
                        </Link>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Original URL: {url.originalUrl}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Clicks: {url.totalClicks}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                      Click Data:
                    </Typography>
                    {url.detailedClicks.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">No clicks recorded.</Typography>
                    ) : (
                      <List dense>
                        {url.detailedClicks.map((click, i) => (
                          <ListItem key={i} disableGutters>
                            <ListItemText
                              primary={`Click ${i + 1}`}
                              secondary={
                                <>
                                  <Typography component="span" variant="body2" color="text.primary">
                                    Timestamp: {new Date(click.timestamp).toLocaleString()}
                                  </Typography>
                                  <br />
                                  <Typography component="span" variant="body2" color="text.secondary">
                                    Source: {click.source}
                                  </Typography>
                                  <br />
                                  <Typography component="span" variant="body2" color="text.secondary">
                                    Location: {click.location}
                                  </Typography>
                                </>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </AccordionDetails>
                </Accordion>
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
};

export default StatsPage;