import { Team } from '../models/Team.js';

export const createTeam = async (req, res) => {
  try {
    const newTeam = new Team(req.body);
    const savedTeam = await newTeam.save();
    res.status(201).json(savedTeam);
  } catch (error) {
    res.status(400).json({ message: 'Error creating team', error: error.message });
  }
};

export const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate('members', 'name email');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teams', error: error.message });
  }
};

export const updateTeam = async (req, res) => {
  try {
    const updatedTeam = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTeam);
  } catch (error) {
    res.status(400).json({ message: 'Error updating team', error: error.message });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting team', error: error.message });
  }
};
