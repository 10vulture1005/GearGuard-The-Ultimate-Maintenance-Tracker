import { WorkCentre } from '../models/WorkCentre.js';

export const createWorkCentre = async (req, res) => {
  try {
    const newWorkCentre = new WorkCentre(req.body);
    const savedWorkCentre = await newWorkCentre.save();
    res.status(201).json(savedWorkCentre);
  } catch (error) {
    res.status(400).json({ message: 'Error creating work centre', error: error.message });
  }
};

export const getAllWorkCentres = async (req, res) => {
  try {
    const workCentres = await WorkCentre.find();
    res.json(workCentres);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching work centres', error: error.message });
  }
};

export const updateWorkCentre = async (req, res) => {
  try {
    const updatedWorkCentre = await WorkCentre.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedWorkCentre);
  } catch (error) {
    res.status(400).json({ message: 'Error updating work centre', error: error.message });
  }
};

export const deleteWorkCentre = async (req, res) => {
  try {
    await WorkCentre.findByIdAndDelete(req.params.id);
    res.json({ message: 'Work centre deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting work centre', error: error.message });
  }
};
