import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({ baseURL: API_URL });

export const getCountryData = (code) => api.get(`/country/${code}`).then(r => r.data);
export const searchCountries = (q) => api.get(`/country/search?q=${q}`).then(r => r.data);
export const getFeaturedNews = () => api.get('/country/featured-news').then(r => r.data);
export const getMarkets = () => api.get('/markets').then(r => r.data);
export const submitFeedback = (data) => api.post('/feedback', data).then(r => r.data);
export const saveCountry = (data) => api.post('/saved', data).then(r => r.data);
export const getSavedCountries = () => api.get('/saved').then(r => r.data);
export const removeSavedCountry = (code) => api.delete(`/saved/${code}`).then(r => r.data);
