import axios from 'axios';

const api = axios.create({
  // URL base da nossa API que está rodando na porta 3001
  baseURL: 'http://localhost:3001/api',
});

export default api;
