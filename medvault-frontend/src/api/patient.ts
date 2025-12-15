import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

export function registerPatient(payload: any) {
  return api.post('/auth/register', payload);
}

export function loginPatient(payload: any) {
  return api.post('/auth/login', payload);
}
