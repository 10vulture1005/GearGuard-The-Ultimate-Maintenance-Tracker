import { Equipment } from '../models/Equipment.js';

export const createEquipment = async (req, res) => {
  try {
    const newEquipment = new Equipment(req.body);
    const savedEquipment = await newEquipment.save();
    res.status(201).json(savedEquipment);
  } catch (error) {
    res.status(400).json({ message: 'Error creating equipment', error: error.message });
  }
};

export const getAllEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find()
      .populate('category', 'name')
      .populate('maintenanceTeam', 'name')
      .populate('technician', 'name email');
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching equipment', error: error.message });
  }
};
