import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true // e.g., "Mechanics", "IT Support"
  },
  members: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  company: { type: String, default: 'My Company (San Francisco)' }
}, { timestamps: true });

export const Team = mongoose.model('Team', teamSchema);
