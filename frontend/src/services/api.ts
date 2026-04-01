import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:5000'
    : 'https://fhir-api.up.railway.app');

const API = axios.create({
  baseURL: API_BASE_URL,
});

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

// Observation APIs
export const createObservation = (patient_id: string, data: object) =>
  API.post(`/fhir/r4/Patient/${patient_id}/observations`, data);

export const getObservationsByPatient = (patient_id: string) =>
  API.get(`/fhir/r4/Patient/${patient_id}/observations`);

export default API;