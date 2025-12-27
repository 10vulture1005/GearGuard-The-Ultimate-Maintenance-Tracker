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
