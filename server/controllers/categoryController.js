import { EquipmentCategory } from '../models/EquipmentCategory.js';

export const createCategory = async (req, res) => {
  try {
    const newCategory = new EquipmentCategory(req.body);
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: 'Error creating category', error: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await EquipmentCategory.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const updatedCategory = await EquipmentCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: 'Error updating category', error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await EquipmentCategory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};
