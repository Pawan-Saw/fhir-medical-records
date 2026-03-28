import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
});

// Har request mein token automatically add hoga
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const registerUser = (data: object) => 
  API.post('/api/auth/register', data);

export const loginUser = (data: object) => 
  API.post('/api/auth/login', data);

// Patient APIs
export const createPatient = (data: object) => 
  API.post('/fhir/r4/Patient', data);

export const getAllPatients = () => 
  API.get('/fhir/r4/Patient');

export const getPatientById = (id: string) => 
  API.get(`/fhir/r4/Patient/${id}`);

export const updatePatient = (id: string, data: object) => 
  API.put(`/fhir/r4/Patient/${id}`, data);

export default API;