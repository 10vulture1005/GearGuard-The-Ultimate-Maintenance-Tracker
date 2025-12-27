import express from 'express';
import { Maintenance } from '../models/Maintenance.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Apply middleware to all routes
router.use(authenticateToken);

// POST /maintenance/create
router.post('/create', async (req, res) => {
  try {
    const newRequest = new Maintenance(req.body);
    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    console.error('Error creating maintenance request:', error);
    res.status(400).json({ message: 'Error creating request', error: error.message });
  }
});

// GET /maintenance/all
router.get('/all', async (req, res) => {
  try {
    const requests = await Maintenance.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /maintenance/:id
router.get('/:id', async (req, res) => {
  try {
    const request = await Maintenance.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /maintenance/update/:id
router.put('/update/:id', async (req, res) => {
  try {
    const request = await Maintenance.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Check if the user is the creator
    // Assuming request.createdBy stores the user ID
    if (request.createdBy.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'You are not allowed to edit this request' });
    }

    const updatedRequest = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedRequest);
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(400).json({ message: 'Error updating request', error: error.message });
  }
});

// DELETE /maintenance/delete/:id
router.delete('/delete/:id', async (req, res) => {
  try {
    const request = await Maintenance.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Check if the user is the creator
    if (request.createdBy.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'You are not allowed to delete this request' });
    }

    await Maintenance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
