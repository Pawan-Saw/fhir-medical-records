import { Request, Response } from 'express';
import * as observationService from './observation.service';

export const createObservation = async (req: Request, res: Response) => {
  try {
    const observation = await observationService.createObservation({
      ...req.body,
      patient_id: req.params.patient_id,
    });
    res.status(201).json(observation);
  } catch (error) {
    res.status(500).json({ message: 'Error creating observation', error });
  }
};

export const getObservationsByPatient = async (req: Request, res: Response) => {
  try {
    const observations = await observationService.getObservationsByPatient(
      req.params.patient_id
    );
    res.status(200).json(observations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching observations', error });
  }
};