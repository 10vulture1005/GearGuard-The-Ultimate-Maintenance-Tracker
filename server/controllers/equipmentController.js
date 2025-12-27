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
      .populate('technician', 'name email')
      .populate('employee', 'name email');
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching equipment', error: error.message });
  }
};

export const updateEquipment = async (req, res) => {
  try {
    const updatedEquipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEquipment);
  } catch (error) {
    res.status(400).json({ message: 'Error updating equipment', error: error.message });
  }
};

export const deleteEquipment = async (req, res) => {
  try {
    await Equipment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting equipment', error: error.message });
  }
};
