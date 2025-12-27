import express from 'express';
import { createTeam, getAllTeams, updateTeam, deleteTeam } from '../controllers/teamController.js';

const router = express.Router();

router.get('/', getAllTeams);
router.post('/create', createTeam);
router.put('/update/:id', updateTeam);
router.delete('/delete/:id', deleteTeam);

export default router;
