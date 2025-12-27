import express from 'express';
import { createWorkCentre, getAllWorkCentres, updateWorkCentre, deleteWorkCentre } from '../controllers/workCentreController.js';

const router = express.Router();

router.get('/', getAllWorkCentres);
router.post('/create', createWorkCentre);
router.put('/update/:id', updateWorkCentre);
router.delete('/delete/:id', deleteWorkCentre);

export default router;
