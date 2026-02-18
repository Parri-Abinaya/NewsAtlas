const axios = require('axios');
const cache = require('../utils/cache');

exports.getMarketOverview = async (req, res) => {
  const cacheKey = 'market_overview';
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  // Return realistic mock data (Finnhub free tier is rate-limited)
  const data = {
    indices: [
      { name: 'S&P 500', symbol: 'SPX', value: 5021.84, change: 0.42, changePercent: 0.42 },
      { name: 'NASDAQ', symbol: 'COMP', value: 15927.90, change: -0.29, changePercent: -0.29 },
      { name: 'Dow Jones', symbol: 'DJI', value: 38654.42, change: 0.16, changePercent: 0.16 },
      { name: 'FTSE 100', symbol: 'UKX', value: 7630.53, change: -0.15, changePercent: -0.15 },
      { name: 'DAX', symbol: 'DAX', value: 17117.57, change: 0.33, changePercent: 0.33 },
      { name: 'Nikkei 225', symbol: 'NKY', value: 38460.08, change: 1.28, changePercent: 1.28 },
    ],
    currencies: [
      { pair: 'EUR/USD', rate: 1.0842, change: 0.12 },
      { pair: 'GBP/USD', rate: 1.2654, change: -0.08 },
      { pair: 'USD/JPY', rate: 149.72, change: 0.21 },
      { pair: 'USD/CNY', rate: 7.1923, change: 0.05 },
      { pair: 'AUD/USD', rate: 0.6512, change: -0.14 },
    ],
    commodities: [
      { name: 'Gold', unit: 'oz', price: 2025.40, change: 0.54 },
      { name: 'Silver', unit: 'oz', price: 22.87, change: -0.31 },
      { name: 'Crude Oil', unit: 'bbl', price: 78.34, change: 1.22 },
      { name: 'Natural Gas', unit: 'MMBtu', price: 2.14, change: -2.10 },
    ],
    updatedAt: new Date().toISOString()
  };

  cache.set(cacheKey, data, 300);
  res.json(data);
};
