import { Request, Response } from 'express';
import * as patientService from './patient.service';

export const createPatient = async (req: Request, res: Response) => {
  try {
    const patient = await patientService.createPatient(req.body);
    res.status(201).json({
      resourceType: 'Patient',
      id: patient.id,
      data: patient
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating patient', error });
  }
};

export const getAllPatients = async (req: Request, res: Response) => {
  try {
    const patients = await patientService.getAllPatients();
    res.status(200).json({
      resourceType: 'Bundle',
      total: patients.length,
      entry: patients
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients', error });
  }
};

export const getPatientById = async (req: Request, res: Response) => {
  try {
    const patient = await patientService.getPatientById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json({
      resourceType: 'Patient',
      id: patient.id,
      data: patient
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient', error });
  }
};

export const updatePatient = async (req: Request, res: Response) => {
  try {
    const patient = await patientService.updatePatient(req.params.id, req.body);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json({
      resourceType: 'Patient',
      id: patient.id,
      data: patient
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating patient', error });
  }
};