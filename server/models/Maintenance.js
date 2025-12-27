import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdById: { type: String, required: true },
  maintenanceFor: { type: String, required: true },
  equipment: {
    name: { type: String, required: true },
    id: { type: String, required: true },
    category: { type: String, required: true }
  },
  requestDate: { type: Date, default: Date.now },
  maintenanceType: { 
    type: String, 
    enum: ['Corrective', 'Preventive'], 
    required: true 
  },
  team: { type: String },
  technician: { type: String },
  scheduledDate: { type: Date },
  durationHours: { type: Number },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'], 
    default: 'Medium' 
  },
  company: { type: String },
  status: { 
    type: String, 
    enum: ['New Request', 'In Progress', 'Repaired', 'Scrap', 'Blocked', 'Ready for Next Stage'], 
    default: 'New Request' 
  },
  notes: { type: String },
  instructions: { type: String }
}, { timestamps: true });

export const Maintenance = mongoose.model('Maintenance', maintenanceSchema);
