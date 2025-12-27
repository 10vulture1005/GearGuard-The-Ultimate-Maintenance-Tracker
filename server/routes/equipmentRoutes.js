import express from 'express';
import { createEquipment, getAllEquipment } from '../controllers/equipmentController.js';

const router = express.Router();

router.get('/', getAllEquipment);
router.post('/create', createEquipment);

export default router;
