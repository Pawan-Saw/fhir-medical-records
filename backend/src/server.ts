import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './config/db';
import patientRoutes from './fhir/patient.routes';
import authRoutes from './auth/auth.routes';
import observationRoutes from './observations/observation.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Auth Routes
app.use('/api/auth', authRoutes);

// FHIR Routes
app.use('/fhir/r4/Patient', patientRoutes);
app.use('/fhir/r4/Patient/:patient_id/observations', observationRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: '🏥 FHIR Medical Records API is running!',
    version: 'R4'
  });
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});