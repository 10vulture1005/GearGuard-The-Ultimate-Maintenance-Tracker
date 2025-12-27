import express from 'express';
import { createWorkCentre, getAllWorkCentres } from '../controllers/workCentreController.js';

const router = express.Router();

router.get('/', getAllWorkCentres);
router.post('/create', createWorkCentre);

export default router;
