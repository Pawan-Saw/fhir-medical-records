import { Router } from 'express';
import * as observationController from './observation.controller';

const router = Router({ mergeParams: true });

router.post('/', observationController.createObservation);
router.get('/', observationController.getObservationsByPatient);

export default router;