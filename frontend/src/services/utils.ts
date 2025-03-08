// src/services/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:4001/api';  // Change cela si nécessaire selon ton serveur

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
