import express from 'express';
import { createEquipment, getAllEquipment, updateEquipment, deleteEquipment } from '../controllers/equipmentController.js';

const router = express.Router();

router.get('/', getAllEquipment);
router.post('/create', createEquipment);
router.put('/update/:id', updateEquipment);
router.delete('/delete/:id', deleteEquipment);

export default router;
