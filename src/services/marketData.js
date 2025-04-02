import { API_CONFIG } from '../utils/api-config';

const TOP_STOCKS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA',
  'META', 'BRK.B', 'TSLA', 'UNH', 'JPM'
];

// Cache for storing fetched data
const dataCache = {
  stocks: new Map(),
  crypto: new Map(),
  lastUpdated: 0
};

// Fetch data with caching and rate limiting
export const fetchStockData = async (symbol) => {
  try {
    // Check cache first (cache valid for 1 minute)
    if (dataCache.stocks.has(symbol) && Date.now() - dataCache.lastUpdated < 60000) {
      return dataCache.stocks.get(symbol);
    }

    // Add delay to avoid rate limits (5 requests per minute for free tier)
    await new Promise(resolve => setTimeout(resolve, 250));

    const response = await fetch(
      `${API_CONFIG.ALPHA_VANTAGE.BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_CONFIG.ALPHA_VANTAGE.API_KEY}`
    );
    const data = await response.json();

    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }

    if (data['Note']) {
      // API limit reached, return mock data
      return getMockStockData(symbol);
    }

    const stockData = {
      symbol,
      price: parseFloat(data['Global Quote']['05. price']),
      change: parseFloat(data['Global Quote']['09. change']),
      changePercent: parseFloat(data['Global Quote']['10. change percent'].replace('%', '')),
    };

    // Update cache
    dataCache.stocks.set(symbol, stockData);
    dataCache.lastUpdated = Date.now();

    return stockData;
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    return getMockStockData(symbol);
  }
};

export const fetchAllTopStocks = async () => {
  const stockPromises = TOP_STOCKS.map(symbol => fetchStockData(symbol));
  const stocks = await Promise.all(stockPromises);
  return stocks.filter(stock => stock !== null);
};

export const fetchTopCryptos = async () => {
  try {
    // Check cache
    if (dataCache.crypto.size > 0 && Date.now() - dataCache.lastUpdated < 60000) {
      return Array.from(dataCache.crypto.values());
    }

    const response = await fetch(
      `${API_CONFIG.COINGECKO.BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&sparkline=false`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch crypto data');
    }

    const data = await response.json();
    const cryptos = data.map(crypto => ({
      symbol: crypto.symbol.toUpperCase(),
      name: crypto.name,
      price: crypto.current_price,
      change: crypto.price_change_24h,
      changePercent: crypto.price_change_percentage_24h,
      image: crypto.image,
    }));

    // Update cache
    cryptos.forEach(crypto => dataCache.crypto.set(crypto.symbol, crypto));
    dataCache.lastUpdated = Date.now();

    return cryptos;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return getMockCryptoData();
  }
};

// Mock data for when API limits are reached
const getMockStockData = (symbol) => ({
  symbol,
  price: 150 + Math.random() * 50,
  change: (Math.random() * 10) - 5,
  changePercent: (Math.random() * 5) - 2.5,
});

const getMockCryptoData = () => {
  const cryptos = [
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'USDT', name: 'Tether' },
    { symbol: 'BNB', name: 'Binance Coin' },
    { symbol: 'SOL', name: 'Solana' },
  ];

  return cryptos.map(crypto => ({
    ...crypto,
    price: 1000 + Math.random() * 1000,
    change: (Math.random() * 100) - 50,
    changePercent: (Math.random() * 10) - 5,
    image: `https://cryptologos.cc/logos/${crypto.name.toLowerCase()}-${crypto.symbol.toLowerCase()}-logo.png`,
  }));
};

// Function to get historical data for charts
export const fetchHistoricalData = async (symbol, timeFrame) => {
  try {
    // For demo, generate mock historical data
    const points = timeFrame === '1D' ? 24 : 100;
    const basePrice = 150;
    const volatility = 5;
    
    const data = [];
    let currentPrice = basePrice;
    
    for (let i = 0; i < points; i++) {
      currentPrice += (Math.random() - 0.5) * volatility;
      data.push({
        time: Date.now() - ((points - i) * 3600000), // hourly data
        value: Math.max(0, currentPrice),
      });
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return [];
  }
}; 