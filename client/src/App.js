// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  CssBaseline,
  Container,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import UrlForm from './components/UrlForm';
import StatsPage from './components/StatsPage';

// A styled container for the main content
const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  padding: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

// Redirect component (remains the same)
const RedirectHandler = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    window.location.href = `http://localhost:3001/redirect/${shortcode}`;
  }, [shortcode, navigate]);

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h6">Redirecting to the original URL...</Typography>
    </Box>
  );
};

// Home page with URL Shortener form
const HomePage = () => {
  // `urls` state is no longer used in this component, so we can remove it.
  return (
    <Box>
      <UrlForm onUrlShortened={() => {}} /> {/* We can pass an empty function here as we don't need to update state in HomePage */}
    </Box>
  );
};

const App = () => {
  return (
    <Router>
      <CssBaseline />
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AffordMed URL Shortener
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">
            Shorten
          </Button>
          <Button color="inherit" component={RouterLink} to="/stats">
            Statistics
          </Button>
        </Toolbar>
      </AppBar>
      <StyledContainer maxWidth="lg">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/redirect/:shortcode" element={<RedirectHandler />} />
          <Route path="*" element={<Typography variant="h4" sx={{ p: 4, textAlign: 'center' }}>404 Not Found</Typography>} />
        </Routes>
      </StyledContainer>
    </Router>
  );
};

export default App;