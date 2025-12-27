import express from 'express';
import { createCategory, getAllCategories } from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', getAllCategories);
router.post('/create', createCategory);

export default router;
