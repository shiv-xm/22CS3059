// client/src/components/UrlList.js
import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Link,
  Divider,
} from '@mui/material';

const UrlList = ({ urls }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Your Shortened URLs
      </Typography>
      <List>
        {urls.map((url, index) => (
          <Paper key={index} elevation={2} sx={{ mb: 2 }}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <Link href={`http://localhost:3000/redirect/${url.shortcode}`} target="_blank" rel="noopener">
                    http://localhost:3000/redirect/{url.shortcode}
                  </Link>
                }
                secondary={
                  <React.Fragment>
                    <Typography component="span" variant="body2" color="text.primary">
                      Original URL: {url.originalUrl}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2" color="text.secondary">
                      Created: {new Date(url.creationDate).toLocaleString()}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2" color="text.secondary">
                      Expires: {new Date(url.expiryDate).toLocaleString()}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            {index < urls.length - 1 && <Divider component="li" />}
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default UrlList;