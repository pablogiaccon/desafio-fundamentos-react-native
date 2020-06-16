import axios from 'axios';

// Executar o servidor json

// yarn json-server --host 192.168.50.215 -p 3333 --watch server.json

const api = axios.create({
  baseURL: 'http://192.168.50.215:3333',
  // baseURL: 'http://localhost:3333',
});

export default api;
