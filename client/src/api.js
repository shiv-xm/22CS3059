// client/src/api.js
const API_BASE_URL = 'http://localhost:3001/api';

export const shortenUrl = async (urlData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/shorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(urlData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to shorten URL');
    }
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch statistics');
    }
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};