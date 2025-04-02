export const API_CONFIG = {
  ALPHA_VANTAGE: {
    BASE_URL: 'https://www.alphavantage.co/query',
    API_KEY: process.env.REACT_APP_ALPHA_VANTAGE_API_KEY
  },
  COINGECKO: {
    BASE_URL: 'https://api.coingecko.com/api/v3',
    API_KEY: process.env.REACT_APP_COINGECKO_API_KEY
  }
};

// Check if we have all required API keys
const requiredApiKeys = [
  'REACT_APP_ALPHA_VANTAGE_API_KEY',
  'REACT_APP_COINGECKO_API_KEY'
];

requiredApiKeys.forEach(keyName => {
  if (!process.env[keyName]) {
    console.warn(`Missing API key: ${keyName}`);
  }
}); 