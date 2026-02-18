const axios = require('axios');
const cache = require('../utils/cache');
const { generateSummary } = require('../utils/aiSummary');

// Fetch country facts from REST Countries API
async function getCountryFacts(countryCode) {
  const cacheKey = `facts_${countryCode}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const res = await axios.get(`https://restcountries.com/v3.1/alpha/${countryCode}`);
    const c = res.data[0];
    const data = {
      name: c.name.common,
      officialName: c.name.official,
      capital: c.capital?.[0] || 'N/A',
      region: c.region,
      subregion: c.subregion,
      population: c.population,
      area: c.area,
      languages: Object.values(c.languages || {}),
      currencies: Object.entries(c.currencies || {}).map(([code, info]) => ({
        code,
        name: info.name,
        symbol: info.symbol
      })),
      flag: c.flags?.svg || c.flags?.png,
      flagEmoji: c.flag,
      timezones: c.timezones,
      latlng: c.latlng,
      borders: c.borders || [],
      maps: c.maps?.googleMaps
    };
    cache.set(cacheKey, data, 3600);
    return data;
  } catch (err) {
    console.error('Country facts error:', err.message);
    return null;
  }
}

// Fetch news from GNews API
async function getCountryNews(countryName, countryCode) {
  const cacheKey = `news_${countryCode}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) return getMockNews(countryName);

  try {
    const res = await axios.get('https://gnews.io/api/v4/search', {
      params: {
        q: countryName,
        lang: 'en',
        max: 8,
        token: apiKey
      }
    });
    const articles = res.data.articles || [];
    cache.set(cacheKey, articles, 300);
    return articles;
  } catch (err) {
    console.error('News error:', err.message);
    return getMockNews(countryName);
  }
}

function getMockNews(countryName) {
  return Array.from({ length: 5 }, (_, i) => ({
    title: `Latest developments in ${countryName}: Update ${i + 1}`,
    description: `Breaking news and analysis from ${countryName} covering politics, economy, and society.`,
    url: '#',
    image: `https://picsum.photos/seed/${countryName}${i}/400/200`,
    publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
    source: { name: 'News Atlas' }
  }));
}

// Fetch weather from OpenWeatherMap
async function getCountryWeather(capital, countryCode) {
  const cacheKey = `weather_${countryCode}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey || capital === 'N/A') return getMockWeather(capital);

  try {
    const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { q: capital, appid: apiKey, units: 'metric' }
    });
    const d = res.data;
    const data = {
      city: d.name,
      temp: Math.round(d.main.temp),
      feelsLike: Math.round(d.main.feels_like),
      humidity: d.main.humidity,
      description: d.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`,
      windSpeed: d.wind.speed,
      visibility: d.visibility / 1000
    };
    cache.set(cacheKey, data, 600);
    return data;
  } catch (err) {
    console.error('Weather error:', err.message);
    return getMockWeather(capital);
  }
}

function getMockWeather(capital) {
  const temps = [12, 18, 24, 28, 8, 32, 15, 22];
  const descs = ['partly cloudy', 'clear sky', 'light rain', 'overcast'];
  const t = temps[Math.floor(Math.random() * temps.length)];
  return {
    city: capital,
    temp: t,
    feelsLike: t - 2,
    humidity: 55 + Math.floor(Math.random() * 30),
    description: descs[Math.floor(Math.random() * descs.length)],
    icon: 'https://openweathermap.org/img/wn/02d@2x.png',
    windSpeed: 3 + Math.random() * 8,
    visibility: 8 + Math.random() * 4
  };
}

// Fetch currency exchange
async function getCurrencyData(currencies) {
  const cacheKey = `currency_${currencies?.[0]?.code}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const apiKey = process.env.EXCHANGE_API_KEY;
  const baseCurrency = currencies?.[0]?.code || 'USD';

  if (!apiKey) return getMockCurrency(baseCurrency, currencies);

  try {
    const res = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
    const rates = res.data.conversion_rates;
    const data = {
      base: 'USD',
      currency: baseCurrency,
      rate: rates[baseCurrency] || 1,
      symbol: currencies?.[0]?.symbol || '$',
      name: currencies?.[0]?.name || 'US Dollar',
      popular: {
        EUR: rates['EUR'],
        GBP: rates['GBP'],
        JPY: rates['JPY'],
        CNY: rates['CNY']
      }
    };
    cache.set(cacheKey, data, 1800);
    return data;
  } catch (err) {
    console.error('Currency error:', err.message);
    return getMockCurrency(baseCurrency, currencies);
  }
}

function getMockCurrency(code, currencies) {
  const rates = { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, INR: 83.1, CNY: 7.24, BRL: 4.97, AUD: 1.53 };
  return {
    base: 'USD',
    currency: code,
    rate: rates[code] || (0.5 + Math.random() * 5).toFixed(2),
    symbol: currencies?.[0]?.symbol || '$',
    name: currencies?.[0]?.name || code,
    popular: { EUR: 0.92, GBP: 0.79, JPY: 149.5, CNY: 7.24 }
  };
}

exports.getAggregatedCountryData = async (req, res) => {
  const { code } = req.params;
  const upperCode = code.toUpperCase();
  
  try {
    const facts = await getCountryFacts(upperCode);
    if (!facts) return res.status(404).json({ error: 'Country not found' });

    const [news, weather, currency] = await Promise.all([
      getCountryNews(facts.name, upperCode),
      getCountryWeather(facts.capital, upperCode),
      getCurrencyData(facts.currencies)
    ]);

    const summary = await generateSummary(facts.name, news, facts);

    res.json({ facts, news, weather, currency, summary });
  } catch (err) {
    console.error('Aggregation error:', err);
    res.status(500).json({ error: 'Failed to aggregate country data' });
  }
};

exports.searchCountries = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  try {
    const response = await axios.get(`https://restcountries.com/v3.1/name/${q}?fields=name,cca2,flags,region,capital`);
    const results = response.data.slice(0, 8).map(c => ({
      code: c.cca2,
      name: c.name.common,
      flag: c.flags?.png,
      region: c.region,
      capital: c.capital?.[0]
    }));
    res.json(results);
  } catch (err) {
    res.json([]);
  }
};

exports.getFeaturedNews = async (req, res) => {
  const cacheKey = 'featured_news';
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) {
    return res.json(getMockNews('World'));
  }

  try {
    const response = await axios.get('https://gnews.io/api/v4/top-headlines', {
      params: { lang: 'en', max: 10, token: apiKey }
    });
    const articles = response.data.articles || [];
    cache.set(cacheKey, articles, 600);
    res.json(articles);
  } catch (err) {
    res.json(getMockNews('World'));
  }
};
