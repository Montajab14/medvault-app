import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

export function registerPatient(payload: {
  email: string;
  passwordHash: string;
  salt: string;
  encryptedData: string;
}) {
  return api.post('/auth/register', payload);
}

export function loginPatient(payload: { 
  email: string; 
  passwordHash: string; 
}) {
  return api.post('/auth/login', payload);
}